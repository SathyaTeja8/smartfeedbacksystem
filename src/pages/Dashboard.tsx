import { FeedbackForm } from "@/components/FeedbackForm";
import { SentimentChart } from "@/components/SentimentChart";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const Dashboard = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate("/auth");
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
        navigate("/auth");
      }
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
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
            <h1 className="text-4xl md:text-5xl font-bold bg-[var(--gradient-primary)] bg-clip-text text-transparent mb-2 animate-pulse-glow">
              Feedback Analysis System
            </h1>
            <p className="text-muted-foreground animate-fade-in">
              AI-powered sentiment analysis for real-time insights
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

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="animate-slide-in-left">
            <FeedbackForm onFeedbackSubmitted={() => setRefreshKey(prev => prev + 1)} />
          </div>
          <div className="animate-slide-in-right">
            <SentimentChart key={refreshKey} />
          </div>
        </div>

        <footer className="text-center text-muted-foreground text-sm mt-12 pb-8 animate-fade-in">
          <p>Powered by AI sentiment analysis • Built with React & Lovable Cloud</p>
        </footer>
      </div>
    </div>
  );
};

export default Dashboard;