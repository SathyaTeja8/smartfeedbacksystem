-- Fix function search path security issue
CREATE OR REPLACE FUNCTION public.get_sentiment_summary()
RETURNS TABLE (sentiment TEXT, count BIGINT)
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT sentiment, COUNT(*) as count
  FROM public.feedback
  GROUP BY sentiment
  ORDER BY sentiment;
$$;