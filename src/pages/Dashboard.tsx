import { FeedbackForm } from "@/components/FeedbackForm";
import { SentimentChart } from "@/components/SentimentChart";
import { useState } from "react";

export const Dashboard = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-background">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-[var(--gradient-primary)] bg-clip-text text-transparent mb-2">
            Feedback Analysis System
          </h1>
          <p className="text-muted-foreground">
            AI-powered sentiment analysis for real-time insights
          </p>
        </header>

        <div className="grid lg:grid-cols-2 gap-8">
          <FeedbackForm onFeedbackSubmitted={() => setRefreshKey(prev => prev + 1)} />
          <SentimentChart key={refreshKey} />
        </div>

        <footer className="text-center text-muted-foreground text-sm mt-12 pb-8">
          <p>Powered by AI sentiment analysis • Built with React & Lovable Cloud</p>
        </footer>
      </div>
    </div>
  );
};

export default Dashboard;