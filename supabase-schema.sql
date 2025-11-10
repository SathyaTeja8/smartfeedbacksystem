-- =====================================================
-- Supabase Schema for Sentiment Analysis Application
-- Supports: User Auth, Feedback, Admin Roles, Real-time
-- =====================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABLES
-- =====================================================

-- 1. Profiles Table (stores user profile information)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    display_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. User Roles Table (manages admin/user roles)
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('admin', 'user')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, role)
);

-- 3. Feedback Table (stores all feedback submissions)
CREATE TABLE IF NOT EXISTS public.feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    message TEXT NOT NULL,
    sentiment TEXT NOT NULL CHECK (sentiment IN ('positive', 'negative', 'neutral')),
    sentiment_score DECIMAL(3, 2) DEFAULT 0,
    category TEXT DEFAULT 'general' CHECK (category IN ('general', 'bug', 'feature', 'support', 'other')),
    is_anonymous BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEXES (for performance optimization)
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON public.user_roles(role);
CREATE INDEX IF NOT EXISTS idx_feedback_user_id ON public.feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_feedback_sentiment ON public.feedback(sentiment);
CREATE INDEX IF NOT EXISTS idx_feedback_category ON public.feedback(category);
CREATE INDEX IF NOT EXISTS idx_feedback_created_at ON public.feedback(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_feedback_is_anonymous ON public.feedback(is_anonymous);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
-- Users can read all profiles
CREATE POLICY "Users can read all profiles"
    ON public.profiles FOR SELECT
    USING (true);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- User Roles Policies
-- Admins can read all roles
CREATE POLICY "Admins can read all roles"
    ON public.user_roles FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.user_roles
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- Users can read their own role
CREATE POLICY "Users can read own role"
    ON public.user_roles FOR SELECT
    USING (user_id = auth.uid());

-- Only service role can insert/update roles (via backend)
CREATE POLICY "Service role can manage roles"
    ON public.user_roles FOR ALL
    USING (auth.jwt()->>'role' = 'service_role');

-- Feedback Policies
-- Everyone can read all feedback (for stats and charts)
CREATE POLICY "Anyone can read all feedback"
    ON public.feedback FOR SELECT
    USING (true);

-- Authenticated users can insert feedback
CREATE POLICY "Authenticated users can insert feedback"
    ON public.feedback FOR INSERT
    WITH CHECK (
        auth.uid() = user_id OR is_anonymous = true
    );

-- Anonymous users can insert anonymous feedback
CREATE POLICY "Anonymous users can insert feedback"
    ON public.feedback FOR INSERT
    WITH CHECK (is_anonymous = true);

-- Users can update their own feedback
CREATE POLICY "Users can update own feedback"
    ON public.feedback FOR UPDATE
    USING (auth.uid() = user_id);

-- Admins can delete any feedback
CREATE POLICY "Admins can delete feedback"
    ON public.feedback FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.user_roles
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, display_name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email)
    );
    
    -- Assign default 'user' role
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'user')
    ON CONFLICT (user_id, role) DO NOTHING;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get sentiment summary (for charts)
CREATE OR REPLACE FUNCTION public.get_sentiment_summary()
RETURNS TABLE (
    sentiment TEXT,
    count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        f.sentiment,
        COUNT(*)::BIGINT
    FROM public.feedback f
    GROUP BY f.sentiment
    ORDER BY f.sentiment;
END;
$$ LANGUAGE plpgsql STABLE;

-- Function to get category summary (for charts)
CREATE OR REPLACE FUNCTION public.get_category_summary()
RETURNS TABLE (
    category TEXT,
    count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COALESCE(f.category, 'general') as category,
        COUNT(*)::BIGINT
    FROM public.feedback f
    GROUP BY COALESCE(f.category, 'general')
    ORDER BY category;
END;
$$ LANGUAGE plpgsql STABLE;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Trigger to create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Trigger to update updated_at on profiles
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger to update updated_at on feedback
DROP TRIGGER IF EXISTS update_feedback_updated_at ON public.feedback;
CREATE TRIGGER update_feedback_updated_at
    BEFORE UPDATE ON public.feedback
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- REALTIME PUBLICATIONS (for real-time updates)
-- =====================================================

-- Enable realtime for feedback table
ALTER PUBLICATION supabase_realtime ADD TABLE public.feedback;

-- =====================================================
-- GRANT PERMISSIONS
-- =====================================================

-- Grant usage on schema
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Grant permissions on tables
GRANT SELECT ON public.profiles TO anon, authenticated;
GRANT INSERT, UPDATE ON public.profiles TO authenticated;

GRANT SELECT ON public.user_roles TO authenticated;

GRANT SELECT, INSERT ON public.feedback TO anon, authenticated;
GRANT UPDATE, DELETE ON public.feedback TO authenticated;

-- Grant execute on functions
GRANT EXECUTE ON FUNCTION public.get_sentiment_summary() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_category_summary() TO anon, authenticated;

-- =====================================================
-- SAMPLE DATA (Optional - for testing)
-- =====================================================

-- Note: To create an admin user, you need to:
-- 1. Sign up a user normally through the application
-- 2. Then manually insert their admin role:
-- 
-- INSERT INTO public.user_roles (user_id, role)
-- VALUES ('YOUR_USER_UUID_HERE', 'admin')
-- ON CONFLICT (user_id, role) DO NOTHING;

-- =====================================================
-- STORAGE BUCKETS (if needed for file uploads in future)
-- =====================================================

-- Uncomment if you need file storage
-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('feedback-attachments', 'feedback-attachments', false)
-- ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- CORS CONFIGURATION
-- =====================================================

-- CORS is handled at the Supabase project level in the Dashboard
-- Go to: Project Settings > API > CORS
-- Add your domain (e.g., http://localhost:5173, https://yourdomain.com)

-- =====================================================
-- NOTES FOR DEPLOYMENT
-- =====================================================

-- 1. Run this schema in Supabase SQL Editor
-- 2. Configure CORS in Project Settings > API
-- 3. Set up authentication providers in Authentication > Providers
-- 4. Create your first admin user:
--    a. Register normally via the app
--    b. Get the user's UUID from auth.users table
--    c. Run: INSERT INTO public.user_roles (user_id, role) VALUES ('uuid', 'admin');
-- 5. Enable Realtime in Database > Replication if not already enabled
-- 6. Verify RLS policies are enabled and working correctly