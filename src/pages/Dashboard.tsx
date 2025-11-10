import { FeedbackForm } from "@/components/FeedbackForm";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { UserStats } from "@/components/user/UserStats";
import { UserFeedbackTable } from "@/components/user/UserFeedbackTable";

export const Dashboard = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userFeedback, setUserFeedback] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalFeedback: 0,
    averageSentiment: 0.5,
    lastSubmission: null as string | null,
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (user) {
      loadUserFeedback();
    }
  }, [user, refreshKey]);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate("/login");
      return;
    }

    setUser(session.user);

    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", session.user.id)
      .eq("role", "admin")
      .single();

    setIsAdmin(!!roleData);

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        navigate("/login");
      }
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  };

  const loadUserFeedback = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("feedback")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setUserFeedback(data || []);

      if (data && data.length > 0) {
        const avgSentiment =
          data.reduce((sum, f) => sum + (f.sentiment_score || 0.5), 0) / data.length;

        setStats({
          totalFeedback: data.length,
          averageSentiment: avgSentiment,
          lastSubmission: data[0].created_at,
        });
      }
    } catch (error: any) {
      console.error("Error loading user feedback:", error);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged out",
      description: "See you next time!",
    });
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-background">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-12 flex justify-between items-start animate-fade-in-up">
          <div>
            <h1 className="text-4xl md:text-3xl font-bold bg-gradient-to-r from-[hsl(190,70%,45%)] to-[hsl(270,60%,50%)] bg-clip-text text-transparent mb-2 animate-pulse-glow inline-block border-2 border-[hsl(190,70%,45%)] rounded-lg px-4 py-2">
              Share Your Feedback
            </h1>
            <p className="text-muted-foreground animate-fade-in mt-1">
                  Help us improve with your valuable insights
            </p>
          </div>
          <div className="flex gap-3">
            {isAdmin && (
              <Button variant="outline" onClick={() => navigate("/admin")} className="hover:scale-105 transition-transform animate-slide-in-right">
                <Settings className="mr-2 h-4 w-4" />
                Admin Panel
              </Button>
            )}
            <Button variant="destructive" onClick={handleLogout} className="hover:scale-105 transition-transform">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </header>

        <div className="max-w-2xl mx-auto mb-12 animate-scale-in">
          <FeedbackForm onFeedbackSubmitted={() => setRefreshKey(prev => prev + 1)} />
        </div>

        <div className="max-w-7xl mx-auto">
          <UserStats
            totalFeedback={stats.totalFeedback}
            averageSentiment={stats.averageSentiment}
            lastSubmission={stats.lastSubmission}
          />
          <UserFeedbackTable feedback={userFeedback} />
        </div>

        <footer className="text-center text-muted-foreground text-sm mt-12 pb-8 animate-fade-in">
          <p>Smart Feedback System 2025 • Powered by AI sentiment analysis </p>
        </footer>
      </div>
    </div>
  );
};

export default Dashboard;