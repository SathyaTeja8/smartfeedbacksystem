-- Add category column to feedback table
ALTER TABLE public.feedback 
ADD COLUMN category TEXT DEFAULT 'general' CHECK (category IN ('general', 'bug', 'feature', 'support', 'other'));