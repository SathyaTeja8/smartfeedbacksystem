-- =====================================================
-- QUICK ADMIN USER SETUP
-- =====================================================
-- Use this after a user has registered through your app
-- Replace 'YOUR_EMAIL_HERE' with the actual user email

-- Step 1: Find the user's UUID
SELECT id, email FROM auth.users WHERE email = 'YOUR_EMAIL_HERE';

-- Step 2: Copy the UUID and use it below (replace the placeholder)
INSERT INTO public.user_roles (user_id, role)
VALUES (
    (SELECT id FROM auth.users WHERE email = 'YOUR_EMAIL_HERE'),
    'admin'
)
ON CONFLICT (user_id, role) DO NOTHING;

-- Step 3: Verify admin role was created
SELECT 
    u.email,
    ur.role,
    ur.created_at
FROM auth.users u
JOIN public.user_roles ur ON u.id = ur.user_id
WHERE u.email = 'YOUR_EMAIL_HERE';

-- =====================================================
-- ALTERNATIVE: Direct UUID Method
-- =====================================================
-- If you already know the user UUID:

-- INSERT INTO public.user_roles (user_id, role)
-- VALUES ('paste-uuid-here', 'admin')
-- ON CONFLICT (user_id, role) DO NOTHING;