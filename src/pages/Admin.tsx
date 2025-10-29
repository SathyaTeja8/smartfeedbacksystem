import { Button } from "@/components/ui/button";
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
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Trash2, LogOut, ArrowLeft } from "lucide-react";
import { SentimentChart } from "@/components/SentimentChart";
import { CategoryChart } from "@/components/admin/CategoryChart";
import { StatsCards } from "@/components/admin/StatsCards";
import { UsersTable } from "@/components/admin/UsersTable";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Feedback {
  id: string;
  created_at: string;
  message: string;
  sentiment: string;
  sentiment_score: number;
  is_anonymous: boolean;
  user_id: string | null;
  category: string;
}

interface UserData {
  id: string;
  email: string;
  display_name: string | null;
  created_at: string;
  feedback_count: number;
}

export const Admin = () => {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalFeedback: 0,
    averageSentiment: 0.5,
    feedbackToday: 0,
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      const { data: roleData, error: roleError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .eq("role", "admin")
        .single();

      if (roleError || !roleData) {
        toast({
          variant: "destructive",
          title: "Access Denied",
          description: "You don't have admin privileges",
        });
        navigate("/dashboard");
        return;
      }

      setIsAdmin(true);
      loadFeedback();
      loadUsers();
      loadStats();
    } catch (error) {
      navigate("/auth");
    }
  };

  const loadUsers = async () => {
    try {
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("id, email, display_name, created_at");

      if (profilesError) throw profilesError;

      const usersWithFeedback = await Promise.all(
        (profilesData || []).map(async (profile) => {
          const { count } = await supabase
            .from("feedback")
            .select("*", { count: "exact", head: true })
            .eq("user_id", profile.id);

          return {
            ...profile,
            feedback_count: count || 0,
          };
        })
      );

      setUsers(usersWithFeedback);
    } catch (error: any) {
      console.error("Error loading users:", error);
    }
  };

  const loadStats = async () => {
    try {
      const { count: userCount } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });

      const { data: feedbackData, count: feedbackCount } = await supabase
        .from("feedback")
        .select("sentiment_score, created_at", { count: "exact" });

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const feedbackToday = feedbackData?.filter(
        (f) => new Date(f.created_at) >= today
      ).length || 0;

      const avgSentiment =
        feedbackData && feedbackData.length > 0
          ? feedbackData.reduce((sum, f) => sum + (f.sentiment_score || 0.5), 0) /
            feedbackData.length
          : 0.5;

      setStats({
        totalUsers: userCount || 0,
        totalFeedback: feedbackCount || 0,
        averageSentiment: avgSentiment,
        feedbackToday,
      });
    } catch (error: any) {
      console.error("Error loading stats:", error);
    }
  };

  const loadFeedback = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("feedback")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setFeedback(data || []);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from("feedback").delete().eq("id", id);

      if (error) throw error;

      toast({
        title: "Deleted",
        description: "Feedback deleted successfully",
      });
      loadFeedback();
      loadStats();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
    setDeleteId(null);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

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

  if (!isAdmin || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8 animate-fade-in-up">
          <div>
            <h1 className="text-4xl font-bold bg-[var(--gradient-primary)] bg-clip-text text-transparent mb-2 animate-pulse-glow">
              Analytics Dashboard
            </h1>
            <p className="text-muted-foreground animate-fade-in">Monitor feedback, users, and insights</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => navigate("/dashboard")} className="hover:scale-105 transition-transform">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
            <Button variant="destructive" onClick={handleLogout} className="hover:scale-105 transition-transform">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>

        <StatsCards {...stats} />

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <div className="animate-slide-in-left">
            <SentimentChart />
          </div>
          <div className="animate-slide-in-right">
            <CategoryChart />
          </div>
        </div>

        <div className="mb-8">
          <UsersTable users={users} />
        </div>

        <Card className="border-border/50 bg-card/50 backdrop-blur shadow-[var(--shadow-card)] animate-scale-in hover:shadow-[var(--shadow-glow)] transition-all">
          <CardHeader>
            <CardTitle>All Feedback ({feedback.length})</CardTitle>
            <CardDescription>View and manage user feedback submissions</CardDescription>
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
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
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
                      <TableCell>
                        {item.is_anonymous ? "Anonymous" : "User"}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteId(item.id)}
                          className="hover:scale-110 transition-transform"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {feedback.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground animate-fade-in">
                        No feedback submitted yet
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="animate-scale-in">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Feedback</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this feedback? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="hover:scale-105 transition-transform">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteId && handleDelete(deleteId)} className="hover:scale-105 transition-transform">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Admin;
