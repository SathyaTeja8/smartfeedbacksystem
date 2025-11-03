import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, MessageSquare, TrendingUp, BarChart3 } from "lucide-react";

interface StatsCardsProps {
  totalUsers: number;
  totalFeedback: number;
  averageSentiment: number;
  feedbackToday: number;
}

export const StatsCards = ({ totalUsers, totalFeedback, averageSentiment, feedbackToday }: StatsCardsProps) => {
  const getSentimentLabel = (score: number) => {
    if (score >= 0.6) return "Positive";
    if (score >= 0.4) return "Neutral";
    return "Negative";
  };

  const getSentimentColor = (score: number) => {
    if (score >= 0.6) return "text-success";
    if (score >= 0.4) return "text-warning";
    return "text-destructive";
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
      <Card className="backdrop-blur-sm bg-card/80 border-border/50 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-glow)] transition-all animate-scale-in">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          <Users className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalUsers}</div>
          <p className="text-xs text-muted-foreground">Registered accounts</p>
        </CardContent>
      </Card>

      <Card className="backdrop-blur-sm bg-card/80 border-border/50 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-glow)] transition-all animate-scale-in" style={{ animationDelay: "100ms" }}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Feedback</CardTitle>
          <MessageSquare className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalFeedback}</div>
          <p className="text-xs text-muted-foreground">All time submissions</p>
        </CardContent>
      </Card>

      <Card className="backdrop-blur-sm bg-card/80 border-border/50 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-glow)] transition-all animate-scale-in" style={{ animationDelay: "200ms" }}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg Sentiment</CardTitle>
          <TrendingUp className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${getSentimentColor(averageSentiment)}`}>
            {getSentimentLabel(averageSentiment)}
          </div>
          <p className="text-xs text-muted-foreground">Overall mood: {(averageSentiment * 100).toFixed(0)}%</p>
        </CardContent>
      </Card>

      <Card className="backdrop-blur-sm bg-card/80 border-border/50 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-glow)] transition-all animate-scale-in" style={{ animationDelay: "300ms" }}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Today's Feedback</CardTitle>
          <BarChart3 className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{feedbackToday}</div>
          <p className="text-xs text-muted-foreground">Submitted in last 24h</p>
        </CardContent>
      </Card>
    </div>
  );
};
