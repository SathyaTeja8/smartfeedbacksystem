import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

ChartJS.register(ArcElement, Tooltip, Legend);

export const SentimentChart = () => {
  const [chartData, setChartData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSentimentData = async () => {
    try {
      const { data, error } = await supabase.rpc('get_sentiment_summary');
      
      if (error) throw error;

      const labels = data?.map((item: any) => 
        item.sentiment.charAt(0).toUpperCase() + item.sentiment.slice(1)
      ) || [];
      
      const counts = data?.map((item: any) => Number(item.count)) || [];

      setChartData({
        labels,
        datasets: [
          {
            data: counts,
            backgroundColor: [
              'hsl(142, 76%, 36%)', // success - positive
              'hsl(38, 92%, 50%)',  // warning - neutral
              'hsl(0, 84.2%, 60.2%)', // destructive - negative
            ],
            borderColor: [
              'hsl(142, 76%, 46%)',
              'hsl(38, 92%, 60%)',
              'hsl(0, 84.2%, 70.2%)',
            ],
            borderWidth: 2,
          },
        ],
      });
    } catch (error) {
      console.error('Error fetching sentiment data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSentimentData();

    // Set up realtime subscription
    const channel = supabase
      .channel('feedback-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'feedback'
        },
        () => {
          fetchSentimentData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (isLoading) {
    return (
      <Card className="backdrop-blur-sm bg-card/80 border-border/50 shadow-[var(--shadow-card)]">
        <CardHeader>
          <CardTitle>Sentiment Analysis</CardTitle>
          <CardDescription>Real-time feedback distribution</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="backdrop-blur-sm bg-card/80 border-border/50 shadow-[var(--shadow-card)]">
      <CardHeader>
        <CardTitle className="text-2xl bg-[var(--gradient-primary)] bg-clip-text text-transparent">
          Sentiment Analysis
        </CardTitle>
        <CardDescription>Real-time feedback distribution</CardDescription>
      </CardHeader>
      <CardContent className="h-80 flex items-center justify-center">
        {chartData && chartData.datasets[0].data.reduce((a: number, b: number) => a + b, 0) > 0 ? (
          <Pie 
            data={chartData} 
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'bottom',
                  labels: {
                    color: 'hsl(0, 0%, 98%)',
                    font: {
                      size: 12,
                    },
                  },
                },
                tooltip: {
                  backgroundColor: 'hsl(240, 10%, 3.9%)',
                  titleColor: 'hsl(0, 0%, 98%)',
                  bodyColor: 'hsl(0, 0%, 98%)',
                  borderColor: 'hsl(210, 100%, 56%)',
                  borderWidth: 1,
                },
              },
            }}
          />
        ) : (
          <p className="text-muted-foreground">No feedback data yet. Be the first to submit!</p>
        )}
      </CardContent>
    </Card>
  );
};