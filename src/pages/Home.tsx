import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Brain, MessageSquare, BarChart3, Shield, Sparkles, Zap, TrendingUp, Users } from "lucide-react";
import { AnimatedText } from "@/components/AnimatedText";
import { FeedbackForm } from "@/components/FeedbackForm";

export const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-primary/30 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-secondary/30 rounded-full blur-3xl animate-float [animation-delay:1s]" />
        <div className="absolute top-40 right-20 w-72 h-72 bg-accent/25 rounded-full blur-3xl animate-float [animation-delay:2s]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-primary/15 rounded-full blur-3xl animate-pulse-glow" />
      </div>

      {/* Navigation */}
      <nav className="relative container mx-auto px-4 py-6 animate-fade-in">
        <div className="flex justify-between items-center backdrop-blur-xl bg-card/30 border border-border/50 rounded-2xl px-6 py-4 shadow-[var(--shadow-card)]">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-primary">
              FeedbackAI
            </h1>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={() => navigate("/admin-login")} 
              className="hover:scale-105 transition-all duration-300 border-border/50 backdrop-blur"
            >
              Admin Login
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => navigate("/login")} 
              className="hover:scale-105 transition-all duration-300"
            >
              Login
            </Button>
            <Button 
              onClick={() => navigate("/register")} 
              className="hover:scale-105 transition-all duration-300 bg-primary text-primary-foreground border-0"
            >
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative container mx-auto px-4 py-20">
        <div className="text-center mb-16 space-y-8 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/20 border border-primary/30 backdrop-blur-xl mb-4 animate-scale-in">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="text-sm font-semibold text-primary">
              Smart Feedback System
            </span>
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          
          <div className="relative z-10">
            <AnimatedText
              text="Smart Feedback System"
              animation="wave"
              className="text-6xl md:text-8xl font-black text-primary leading-tight tracking-tighter"
              style={{
                fontFamily: "'Space Grotesk', 'Inter', sans-serif",
                letterSpacing: "-0.02em"
              }}
            />
          </div>
          
          <AnimatedText
            text="Transform Feedback Into Actionable Insights"
            animation="fadeIn"
            className="text-2xl md:text-3xl font-semibold text-muted-foreground max-w-4xl mx-auto leading-relaxed"
          />
          
          <p className="text-lg md:text-xl text-muted-foreground/80 max-w-3xl mx-auto leading-relaxed">
            Harness the power of AI to analyze customer sentiment in real-time.
            Make data-driven decisions with confidence and precision.
          </p>

          {/* CTA Buttons directly under title */}
          <div className="relative p-8 rounded-3xl border-2 border-primary/30 bg-card/50 backdrop-blur-xl animate-scale-in">
            <div className="relative flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                onClick={() => navigate("/register")} 
                className="text-lg px-10 py-6 hover:scale-110 transition-all duration-300 bg-primary text-primary-foreground border-0"
              >
                Create Your Account
              </Button>
              <Button 
                size="lg"
                variant="outline"
                onClick={() => navigate("/login")} 
                className="text-lg px-10 py-6 hover:scale-105 transition-all duration-300 border-primary/30 backdrop-blur hover:bg-primary/10 hover:border-primary/50"
              >
                Sign In
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20 animate-scale-in">
          {[
            { icon: Users, label: "Active Users", value: "Trusted Platform", color: "text-primary" },
            { icon: MessageSquare, label: "Feedback Analyzed", value: "Instant Analysis", color: "text-accent" },
            { icon: TrendingUp, label: "Accuracy Rate", value: "High Precision", color: "text-success" },
            { icon: Zap, label: "Response Time", value: "Lightning Fast", color: "text-warning" },
          ].map((stat, index) => (
            <Card 
              key={index}
              className="border-border/50 bg-card/50 backdrop-blur transition-all duration-500 hover:scale-105 hover:-translate-y-2 animate-fade-in-up group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-6 text-center">
                <stat.icon className={`w-8 h-8 ${stat.color} mx-auto mb-3 animate-float group-hover:scale-110 transition-transform`} />
                <div className="text-xl font-bold text-primary">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features Grid */}
        <div className="mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-primary">
            Powerful Features
          </h2>
          <p className="text-center text-muted-foreground mb-12 text-lg">
            Everything you need to understand your customers better
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Brain,
                title: "AI Analysis",
                description: "Advanced sentiment detection powered by cutting-edge machine learning models",
                gradient: "from-primary/20 to-primary/5"
              },
              {
                icon: MessageSquare,
                title: "Real-time Feedback",
                description: "Collect and analyze feedback instantly from any source with live updates",
                gradient: "from-accent/20 to-accent/5"
              },
              {
                icon: BarChart3,
                title: "Visual Insights",
                description: "Beautiful charts and analytics dashboards for data-driven decisions",
                gradient: "from-success/20 to-success/5"
              },
              {
                icon: Shield,
                title: "Secure & Private",
                description: "Enterprise-grade security with full data encryption and compliance",
                gradient: "from-warning/20 to-warning/5"
              },
            ].map((feature, index) => (
              <Card 
                key={index}
                className="border-border/50 bg-card/50 backdrop-blur transition-all duration-500 hover:scale-105 animate-fade-in-up group hover:-translate-y-3 relative overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <CardHeader className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mb-4 animate-float group-hover:scale-110 transition-transform">
                    <feature.icon className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <Card className="border-primary/30 bg-card/80 backdrop-blur animate-scale-in transition-all duration-500 overflow-hidden relative group">
          <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <CardContent className="p-12 md:p-16 text-center relative">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary mb-6">
              <Sparkles className="w-8 h-8 text-primary-foreground" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-primary">
              Ready to Transform Your Feedback?
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
              Join thousands of companies using FeedbackAI to understand their customers better and make data-driven decisions with confidence.
            </p>
          </CardContent>
        </Card>

        {/* Anonymous Feedback Section */}
        <div className="mt-20 animate-fade-in">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary">
              Try It Now - No Login Required
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Experience our AI-powered sentiment analysis instantly. Submit anonymous feedback and see the magic happen.
            </p>
          </div>
          <div className="max-w-2xl mx-auto">
            <FeedbackForm />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative container mx-auto px-4 py-12 text-center border-t border-border/50 mt-20 animate-fade-in">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg">FeedbackAI</span>
          </div>
          <p className="text-muted-foreground text-sm">
            © 2025 FeedbackAI. Powered by Lovable Cloud & AI
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
