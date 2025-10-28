import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, userId, isAnonymous, category = 'general' } = await req.json();
    console.log('Analyzing sentiment for message:', message);

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Call Lovable AI for sentiment analysis
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: 'You are a sentiment analysis system. Analyze the sentiment of the given text and respond ONLY with a JSON object in this exact format: {"sentiment": "positive" | "neutral" | "negative", "score": number between -1 and 1}. The score should be: positive (0.1 to 1.0), neutral (-0.1 to 0.1), negative (-1.0 to -0.09). Do not include any other text or explanation.'
          },
          {
            role: 'user',
            content: message
          }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    console.log('AI response:', data);
    
    const aiContent = data.choices[0].message.content;
    console.log('AI content:', aiContent);
    
    // Parse the JSON response from AI
    let sentimentData;
    try {
      sentimentData = JSON.parse(aiContent);
    } catch (e) {
      console.error('Failed to parse AI response:', e);
      // Fallback to simple sentiment detection
      const lowerMessage = message.toLowerCase();
      if (lowerMessage.includes('great') || lowerMessage.includes('excellent') || lowerMessage.includes('love')) {
        sentimentData = { sentiment: 'positive', score: 0.5 };
      } else if (lowerMessage.includes('bad') || lowerMessage.includes('terrible') || lowerMessage.includes('hate')) {
        sentimentData = { sentiment: 'negative', score: -0.5 };
      } else {
        sentimentData = { sentiment: 'neutral', score: 0 };
      }
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Store feedback in database
    const { data: feedbackData, error: dbError } = await supabase
      .from('feedback')
      .insert({
        user_id: userId || null,
        message,
        sentiment: sentimentData.sentiment,
        sentiment_score: sentimentData.score,
        is_anonymous: isAnonymous || false,
        category
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      throw dbError;
    }

    console.log('Feedback stored:', feedbackData);

    return new Response(
      JSON.stringify({
        sentiment: sentimentData.sentiment,
        score: sentimentData.score,
        feedbackId: feedbackData.id
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in analyze-sentiment function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});