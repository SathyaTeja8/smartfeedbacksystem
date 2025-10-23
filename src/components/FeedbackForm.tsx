import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Send, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface FeedbackFormProps {
  onFeedbackSubmitted?: () => void;
}

export const FeedbackForm = ({ onFeedbackSubmitted }: FeedbackFormProps) => {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) {
      toast({
        title: "Message required",
        description: "Please enter your feedback before submitting.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id || null;
      const isAnonymous = !session;

      const { data, error } = await supabase.functions.invoke('analyze-sentiment', {
        body: { message, userId, isAnonymous }
      });

      if (error) throw error;

      const sentimentColor = 
        data.sentiment === 'positive' ? 'success' :
        data.sentiment === 'negative' ? 'destructive' : 'warning';

      toast({
        title: "Feedback submitted!",
        description: `Sentiment: ${data.sentiment} (Score: ${data.score?.toFixed(2)})`,
        variant: sentimentColor === 'success' ? 'default' : 'destructive',
      });

      setMessage("");
      onFeedbackSubmitted?.();
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full backdrop-blur-sm bg-card/80 border-border/50 shadow-[var(--shadow-card)]">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold bg-[var(--gradient-primary)] bg-clip-text text-transparent">
          Share Your Feedback
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Your feedback helps us improve. AI-powered sentiment analysis processes your input instantly.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell us what you think..."
              className="min-h-[120px] resize-none border-border/50 bg-secondary/50 focus-visible:ring-primary"
              disabled={isSubmitting}
            />
            <Sparkles className="absolute right-3 top-3 h-4 w-4 text-primary/50" />
          </div>
          <Button
            type="submit"
            disabled={isSubmitting || !message.trim()}
            className="w-full bg-[var(--gradient-primary)] hover:opacity-90 transition-opacity"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Submit Feedback
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};