import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Send, Sparkles, Bug, Lightbulb, HelpCircle, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface FeedbackFormProps {
  onFeedbackSubmitted?: () => void;
}

const categories = [
  { value: "general", label: "General Feedback", icon: MessageCircle },
  { value: "bug", label: "Bug Report", icon: Bug },
  { value: "feature", label: "Feature Request", icon: Lightbulb },
  { value: "support", label: "Support", icon: HelpCircle },
  { value: "other", label: "Other", icon: Sparkles },
];

export const FeedbackForm = ({ onFeedbackSubmitted }: FeedbackFormProps) => {
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState("general");
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
        body: { message, userId, isAnonymous, category }
      });

      if (error) throw error;

      toast({
        title: "Feedback submitted!",
        description: `Sentiment detected: ${data.sentiment}`,
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
    <Card className="w-full backdrop-blur-sm bg-card/80 border-border/50 shadow-[var(--shadow-card)] animate-fade-in-up hover:shadow-[var(--shadow-glow)] transition-all duration-300">
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
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Category</label>
            <Select value={category} onValueChange={setCategory} disabled={isSubmitting}>
              <SelectTrigger className="w-full border-border/50 bg-secondary/50 focus:ring-primary">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <SelectItem key={cat.value} value={cat.value} className="cursor-pointer">
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-primary" />
                        <span>{cat.label}</span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
          <div className="relative">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell us what you think..."
              className="min-h-[120px] resize-none border-border/50 bg-secondary/50 focus-visible:ring-primary transition-all"
              disabled={isSubmitting}
            />
            <Sparkles className="absolute right-3 top-3 h-4 w-4 text-primary/50 animate-pulse" />
          </div>
          <Button
            type="submit"
            disabled={isSubmitting || !message.trim()}
            className="w-full bg-[var(--gradient-primary)] hover:opacity-90 transition-all duration-300 hover:scale-[1.02]"
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