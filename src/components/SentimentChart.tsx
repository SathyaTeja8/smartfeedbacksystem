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
              'hsla(150, 60%, 35%, 0.8)',
              'hsla(0, 65%, 45%, 0.8)',
              'hsla(270, 65%, 55%, 0.8)',
            ],
            borderColor: [
              'hsl(150, 60%, 35%)',
              'hsl(0, 65%, 45%)',
              'hsl(270, 65%, 55%)',
            ],
            borderWidth: 3,
            hoverOffset: 20,
            hoverBorderWidth: 4,
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
    <Card className="backdrop-blur-sm bg-card/80 border-border/50 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-glow)] transition-all duration-300 relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <CardHeader className="relative z-10">
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
          Sentiment Analysis
        </CardTitle>
        <CardDescription className="text-muted-foreground/80">Distribution of feedback sentiment</CardDescription>
      </CardHeader>
      <CardContent className="h-80 flex items-center justify-center relative z-10">
        {chartData && chartData.datasets[0].data.reduce((a: number, b: number) => a + b, 0) > 0 ? (
          <div className="w-full h-full">
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
                      padding: 20,
                      font: {
                        size: 13,
                        weight: 'bold',
                      },
                      usePointStyle: true,
                      pointStyle: 'circle',
                      boxWidth: 12,
                      boxHeight: 12,
                    },
                  },
                  tooltip: {
                    backgroundColor: 'hsla(240, 10%, 3.9%, 0.95)',
                    titleColor: 'hsl(0, 0%, 98%)',
                    bodyColor: 'hsl(0, 0%, 98%)',
                    borderColor: 'hsl(150, 60%, 35%)',
                    borderWidth: 2,
                    padding: 12,
                    displayColors: true,
                    boxPadding: 6,
                    cornerRadius: 8,
                    titleFont: {
                      size: 14,
                      weight: 'bold',
                    },
                    bodyFont: {
                      size: 13,
                    },
                    callbacks: {
                      label: function(context: any) {
                        const label = context.label || '';
                        const value = context.parsed || 0;
                        const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                        const percentage = ((value / total) * 100).toFixed(1);
                        return `${label}: ${value} (${percentage}%)`;
                      }
                    }
                  },
                },
                animation: {
                  animateRotate: true,
                  animateScale: true,
                },
              }} 
            />
          </div>
        ) : (
          <p className="text-muted-foreground">No sentiment data available</p>
        )}
      </CardContent>
    </Card>
  );
};