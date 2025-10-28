import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Brain, MessageSquare, BarChart3, Shield } from "lucide-react";

export const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-background overflow-hidden">
      <nav className="container mx-auto px-4 py-6 flex justify-between items-center animate-fade-in backdrop-blur-sm bg-background/30 rounded-lg mt-4">
        <h1 className="text-2xl font-bold bg-[var(--gradient-primary)] bg-clip-text text-transparent animate-pulse-glow">
          FeedbackAI
        </h1>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => navigate("/admin-login")} className="hover:scale-105 transition-transform">
            Admin Login
          </Button>
          <Button variant="ghost" onClick={() => navigate("/login")} className="hover:scale-105 transition-transform">
            Login
          </Button>
          <Button onClick={() => navigate("/register")} className="hover:scale-105 transition-transform animate-pulse-glow">
            Get Started
          </Button>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-20">
        <div className="text-center mb-16 space-y-4 animate-fade-in-up">
          <h1 className="text-5xl md:text-7xl font-bold bg-[var(--gradient-primary)] bg-clip-text text-transparent">
            AI-Powered Feedback Analysis
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in">
            Transform customer feedback into actionable insights with real-time sentiment analysis
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-20">
          <Card className="border-border/50 bg-card/50 backdrop-blur hover:shadow-[var(--shadow-glow)] transition-all duration-300 hover:scale-105 animate-fade-in-up hover:-translate-y-2">
            <CardHeader>
              <Brain className="w-12 h-12 text-primary mb-4 animate-float" />
              <CardTitle>AI Analysis</CardTitle>
              <CardDescription>
                Advanced sentiment detection powered by machine learning
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur hover:shadow-[var(--shadow-glow)] transition-all duration-300 hover:scale-105 animate-fade-in-up [animation-delay:100ms] hover:-translate-y-2">
            <CardHeader>
              <MessageSquare className="w-12 h-12 text-accent mb-4 animate-float [animation-delay:200ms]" />
              <CardTitle>Real-time Feedback</CardTitle>
              <CardDescription>
                Collect and analyze feedback instantly from any source
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur hover:shadow-[var(--shadow-glow)] transition-all duration-300 hover:scale-105 animate-fade-in-up [animation-delay:200ms] hover:-translate-y-2">
            <CardHeader>
              <BarChart3 className="w-12 h-12 text-primary mb-4 animate-float [animation-delay:400ms]" />
              <CardTitle>Visual Insights</CardTitle>
              <CardDescription>
                Beautiful charts and analytics for data-driven decisions
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur hover:shadow-[var(--shadow-glow)] transition-all duration-300 hover:scale-105 animate-fade-in-up [animation-delay:300ms] hover:-translate-y-2">
            <CardHeader>
              <Shield className="w-12 h-12 text-accent mb-4 animate-float [animation-delay:600ms]" />
              <CardTitle>Secure & Private</CardTitle>
              <CardDescription>
                Enterprise-grade security with full data encryption
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <Card className="mt-20 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5 backdrop-blur animate-scale-in hover:shadow-[var(--shadow-glow)] transition-all">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl font-bold mb-4 animate-fade-in">Ready to get started?</h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto animate-fade-in-up">
              Join thousands of companies using FeedbackAI to understand their customers better
            </p>
            <Button size="lg" onClick={() => navigate("/register")} className="hover:scale-110 transition-transform animate-pulse-glow">
              Create Your Account
            </Button>
          </CardContent>
        </Card>
      </main>

      <footer className="container mx-auto px-4 py-8 text-center text-muted-foreground text-sm border-t border-border/50 mt-20 animate-fade-in">
        <p>© 2025 FeedbackAI. Powered by Lovable Cloud & AI</p>
      </footer>
    </div>
  );
};

export default Home;
