import { Card } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

interface EarningsForecastProps {
  currentBalance: number;
  monthlyForecast: number;
}

export const EarningsForecast = ({ currentBalance, monthlyForecast }: EarningsForecastProps) => {
  return (
    <Card className="p-4 glass-card border-0 shadow-card">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">This Month's Forecast</p>
          <p className="text-2xl font-bold text-success">+${monthlyForecast.toFixed(2)}</p>
          <p className="text-xs text-muted-foreground">Based on current APY</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-gradient-success/20 flex items-center justify-center">
          <TrendingUp className="w-5 h-5 text-success" />
        </div>
      </div>
    </Card>
  );
};
