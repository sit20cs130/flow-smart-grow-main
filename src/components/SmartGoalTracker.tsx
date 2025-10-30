import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Target } from 'lucide-react';

interface SmartGoalTrackerProps {
  goalName: string;
  current: number;
  target: number;
}

export const SmartGoalTracker = ({ goalName, current, target }: SmartGoalTrackerProps) => {
  const progress = (current / target) * 100;
  
  return (
    <Card className="p-4 glass-card border-0 shadow-card">
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
              <Target className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold">{goalName}</p>
              <p className="text-xs text-muted-foreground">Auto-saving from interest</p>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <div className="flex items-baseline justify-between">
            <span className="text-lg font-bold">${current.toFixed(2)}</span>
            <span className="text-sm text-muted-foreground">of ${target.toFixed(2)}</span>
          </div>
          <p className="text-xs text-muted-foreground">{progress.toFixed(0)}% complete</p>
        </div>
      </div>
    </Card>
  );
};
