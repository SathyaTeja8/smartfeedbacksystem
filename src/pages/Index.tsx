import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, User, BarChart3 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { FeedbackForm } from "@/components/FeedbackForm";
import { SentimentChart } from "@/components/SentimentChart";
import { FeedbackHistory } from "@/components/FeedbackHistory";
import type { User as SupabaseUser, Session } from "@supabase/supabase-js";

const Index = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold bg-[var(--gradient-primary)] bg-clip-text text-transparent mb-2">
                Feedback Analysis System
              </h1>
              <p className="text-muted-foreground">
                AI-powered sentiment analysis for real-time insights
              </p>
            </div>
            <div className="flex items-center gap-3">
              {user ? (
                <>
                  <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary/50">
                    <User className="h-4 w-4 text-primary" />
                    <span className="text-sm text-foreground">{user.email}</span>
                  </div>
                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    className="border-border/50 hover:border-destructive hover:text-destructive"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => navigate("/auth")}
                  className="bg-[var(--gradient-primary)] hover:opacity-90"
                >
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <div className="space-y-8">
            <FeedbackForm onFeedbackSubmitted={() => setRefreshKey(prev => prev + 1)} />
            <FeedbackHistory key={refreshKey} />
          </div>
          <div>
            <SentimentChart key={refreshKey} />
            
            {/* Stats Cards */}
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="p-6 rounded-lg bg-gradient-to-br from-success/20 to-success/5 border border-success/20">
                <BarChart3 className="h-8 w-8 text-success mb-2" />
                <p className="text-sm text-muted-foreground">Positive Rate</p>
                <p className="text-2xl font-bold text-success">Real-time</p>
              </div>
              <div className="p-6 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20">
                <BarChart3 className="h-8 w-8 text-primary mb-2" />
                <p className="text-sm text-muted-foreground">Total Feedback</p>
                <p className="text-2xl font-bold text-primary">Growing</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center text-muted-foreground text-sm mt-12 pb-8">
          <p>Powered by AI sentiment analysis • Built with React & Lovable Cloud</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;