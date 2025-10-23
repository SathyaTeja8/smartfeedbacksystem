import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, MessageSquare } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Feedback {
  id: string;
  message: string;
  sentiment: string;
  sentiment_score: number;
  created_at: string;
  is_anonymous: boolean;
  profiles: {
    display_name: string;
  } | null;
}

export const FeedbackHistory = () => {
  const [feedbackList, setFeedbackList] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchFeedback = async () => {
    try {
      const { data, error } = await supabase
        .from('feedback')
        .select(`
          id,
          message,
          sentiment,
          sentiment_score,
          created_at,
          is_anonymous,
          profiles (
            display_name
          )
        `)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setFeedbackList(data || []);
    } catch (error) {
      console.error('Error fetching feedback:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedback();

    const channel = supabase
      .channel('feedback-history')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'feedback'
        },
        () => {
          fetchFeedback();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const getSentimentBadge = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return <Badge className="bg-success text-success-foreground">Positive</Badge>;
      case 'negative':
        return <Badge variant="destructive">Negative</Badge>;
      default:
        return <Badge className="bg-warning text-warning-foreground">Neutral</Badge>;
    }
  };

  if (isLoading) {
    return (
      <Card className="backdrop-blur-sm bg-card/80 border-border/50 shadow-[var(--shadow-card)]">
        <CardHeader>
          <CardTitle>Recent Feedback</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="backdrop-blur-sm bg-card/80 border-border/50 shadow-[var(--shadow-card)]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          Recent Feedback
        </CardTitle>
        <CardDescription>Latest submissions from all users</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {feedbackList.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No feedback submitted yet. Be the first!
          </p>
        ) : (
          feedbackList.map((feedback) => (
            <div
              key={feedback.id}
              className="p-4 rounded-lg bg-secondary/30 border border-border/50 hover:border-primary/50 transition-colors"
            >
              <div className="flex items-start justify-between gap-4 mb-2">
                <div className="flex-1">
                  <p className="text-sm text-foreground">{feedback.message}</p>
                </div>
                {getSentimentBadge(feedback.sentiment)}
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  {feedback.is_anonymous
                    ? "Anonymous"
                    : feedback.profiles?.display_name || "User"}
                </span>
                <span>
                  {formatDistanceToNow(new Date(feedback.created_at), { addSuffix: true })}
                </span>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};