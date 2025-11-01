import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, TrendingUp, Calendar } from "lucide-react";

interface UserStatsProps {
  totalFeedback: number;
  averageSentiment: number;
  lastSubmission: string | null;
}

export const UserStats = ({ totalFeedback, averageSentiment, lastSubmission }: UserStatsProps) => {
  const getSentimentLabel = (score: number) => {
    if (score >= 0.6) return "Positive";
    if (score >= 0.4) return "Neutral";
    return "Negative";
  };

  return (
    <div className="grid md:grid-cols-3 gap-4 mb-8 animate-fade-in-up">
      <Card className="backdrop-blur-sm bg-card/80 border-border/50 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-glow)] transition-all">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Feedback</CardTitle>
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold bg-[var(--gradient-primary)] bg-clip-text text-transparent">
            {totalFeedback}
          </div>
          <p className="text-xs text-muted-foreground">submissions made</p>
        </CardContent>
      </Card>

      <Card className="backdrop-blur-sm bg-card/80 border-border/50 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-glow)] transition-all">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg Sentiment</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold bg-[var(--gradient-primary)] bg-clip-text text-transparent">
            {getSentimentLabel(averageSentiment)}
          </div>
          <p className="text-xs text-muted-foreground">Score: {averageSentiment.toFixed(2)}</p>
        </CardContent>
      </Card>

      <Card className="backdrop-blur-sm bg-card/80 border-border/50 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-glow)] transition-all">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Last Submission</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold bg-[var(--gradient-primary)] bg-clip-text text-transparent">
            {lastSubmission ? new Date(lastSubmission).toLocaleDateString() : "N/A"}
          </div>
          <p className="text-xs text-muted-foreground">most recent feedback</p>
        </CardContent>
      </Card>
    </div>
  );
};
