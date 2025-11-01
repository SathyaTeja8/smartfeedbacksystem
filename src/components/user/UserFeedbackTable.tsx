import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface Feedback {
  id: string;
  created_at: string;
  message: string;
  sentiment: string;
  sentiment_score: number;
  category: string;
}

interface UserFeedbackTableProps {
  feedback: Feedback[];
}

export const UserFeedbackTable = ({ feedback }: UserFeedbackTableProps) => {
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment.toLowerCase()) {
      case "positive":
        return "default";
      case "negative":
        return "destructive";
      case "neutral":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur shadow-[var(--shadow-card)] animate-scale-in hover:shadow-[var(--shadow-glow)] transition-all">
      <CardHeader>
        <CardTitle className="text-2xl bg-[var(--gradient-primary)] bg-clip-text text-transparent">
          Your Feedback History
        </CardTitle>
        <CardDescription>View all your submitted feedback and sentiment analysis</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border border-border/50 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Sentiment</TableHead>
                <TableHead>Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {feedback.map((item, index) => (
                <TableRow key={item.id} className="animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                  <TableCell className="whitespace-nowrap">
                    {new Date(item.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {item.category || 'general'}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-md truncate">{item.message}</TableCell>
                  <TableCell>
                    <Badge variant={getSentimentColor(item.sentiment)} className="animate-scale-in">
                      {item.sentiment}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {item.sentiment_score ? item.sentiment_score.toFixed(2) : "N/A"}
                  </TableCell>
                </TableRow>
              ))}
              {feedback.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground animate-fade-in">
                    No feedback submitted yet. Share your first feedback above!
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
