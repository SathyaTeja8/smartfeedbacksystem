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
            backgroundColor: 'hsla(210, 100%, 56%, 0.8)',
            borderColor: 'hsl(210, 100%, 56%)',
            borderWidth: 2,
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
    <Card className="backdrop-blur-sm bg-card/80 border-border/50 shadow-[var(--shadow-card)]">
      <CardHeader>
        <CardTitle className="text-2xl bg-[var(--gradient-primary)] bg-clip-text text-transparent">
          Feedback by Category
        </CardTitle>
        <CardDescription>Distribution across categories</CardDescription>
      </CardHeader>
      <CardContent className="h-80">
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
                  backgroundColor: 'hsl(240, 10%, 3.9%)',
                  titleColor: 'hsl(0, 0%, 98%)',
                  bodyColor: 'hsl(0, 0%, 98%)',
                  borderColor: 'hsl(210, 100%, 56%)',
                  borderWidth: 1,
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    color: 'hsl(0, 0%, 98%)',
                    stepSize: 1,
                  },
                  grid: {
                    color: 'hsla(0, 0%, 98%, 0.1)',
                  },
                },
                x: {
                  ticks: {
                    color: 'hsl(0, 0%, 98%)',
                  },
                  grid: {
                    display: false,
                  },
                },
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
