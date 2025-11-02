import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export const CategoryChart = () => {
  const [chartData, setChartData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCategoryData = async () => {
    try {
      const { data, error } = await supabase
        .from('feedback')
        .select('category');
      
      if (error) throw error;

      const categoryCounts = data?.reduce((acc: any, item: any) => {
        const category = item.category || 'general';
        acc[category] = (acc[category] || 0) + 1;
        return acc;
      }, {});

      const labels = Object.keys(categoryCounts || {}).map(
        cat => cat.charAt(0).toUpperCase() + cat.slice(1)
      );
      const counts = Object.values(categoryCounts || {}) as number[];

      setChartData({
        labels,
        datasets: [
          {
            label: 'Feedback Count',
            data: counts,
            backgroundColor: [
              'hsla(150, 60%, 35%, 0.8)',
              'hsla(0, 65%, 45%, 0.8)',
              'hsla(270, 65%, 55%, 0.8)',
              'hsla(160, 55%, 40%, 0.8)',
              'hsla(350, 60%, 50%, 0.8)',
            ],
            borderColor: [
              'hsl(150, 60%, 35%)',
              'hsl(0, 65%, 45%)',
              'hsl(270, 65%, 55%)',
              'hsl(160, 55%, 40%)',
              'hsl(350, 60%, 50%)',
            ],
            borderWidth: 2,
            borderRadius: 8,
            borderSkipped: false,
          },
        ],
      });
    } catch (error) {
      console.error('Error fetching category data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoryData();

    const channel = supabase
      .channel('category-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'feedback'
        },
        () => {
          fetchCategoryData();
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
          <CardTitle>Feedback by Category</CardTitle>
          <CardDescription>Distribution across categories</CardDescription>
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
          Feedback by Category
        </CardTitle>
        <CardDescription className="text-muted-foreground/80">Distribution across categories</CardDescription>
      </CardHeader>
      <CardContent className="h-80 relative z-10">
        {chartData && chartData.datasets[0].data.reduce((a: number, b: number) => a + b, 0) > 0 ? (
          <Bar 
            data={chartData} 
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: false,
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
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    color: 'hsl(0, 0%, 98%)',
                    stepSize: 1,
                    font: {
                      size: 12,
                      weight: 'bold',
                    },
                  },
                  grid: {
                    color: 'hsla(150, 60%, 35%, 0.1)',
                    lineWidth: 1,
                  },
                  border: {
                    color: 'hsla(150, 60%, 35%, 0.3)',
                  },
                },
                x: {
                  ticks: {
                    color: 'hsl(0, 0%, 98%)',
                    font: {
                      size: 12,
                      weight: 'bold',
                    },
                  },
                  grid: {
                    display: false,
                  },
                  border: {
                    color: 'hsla(150, 60%, 35%, 0.3)',
                  },
                },
              },
              interaction: {
                mode: 'index',
                intersect: false,
              },
            }}
          />
        ) : (
          <p className="text-muted-foreground flex items-center justify-center h-full">
            No feedback data yet
          </p>
        )}
      </CardContent>
    </Card>
  );
};
