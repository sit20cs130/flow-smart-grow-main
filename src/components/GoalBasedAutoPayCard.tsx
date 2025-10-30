import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Target, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

export const GoalBasedAutoPayCard = () => {
  const [current, setCurrent] = useState(850);
  const target = 1500;
  const percentage = Math.round((current / target) * 100);

  const handleAddToGoal = (amount: number) => {
    toast.success(`Adding $${amount} to your goal...`);
    setTimeout(() => {
      setCurrent(prev => prev + amount);
      toast.success(`Done! You're now at $${current + amount}!`);
    }, 1500);
  };

  return (
    <Card className="p-6 widget-card hover-scale">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-ai-bg flex items-center justify-center">
          <Target className="w-5 h-5 text-ai-blue" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-foreground mb-1">Goal-Based Auto-Pay Agent</h3>
          <p className="text-sm text-muted-foreground">
            Connect your savings goals to real-world deposits
          </p>
        </div>
      </div>

      <div className="bg-ai-bg/50 rounded-xl p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-foreground">New Laptop</h4>
          <span className="text-sm font-bold text-ai-blue">{percentage}%</span>
        </div>
        
        <Progress value={percentage} className="h-2 mb-3" />
        
        <div className="flex justify-between text-sm mb-4">
          <span className="text-muted-foreground">${current.toFixed(2)} saved</span>
          <span className="font-semibold text-foreground">${target.toFixed(2)} goal</span>
        </div>

        <div className="border-t border-border pt-3">
          <div className="flex items-start gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-action mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-foreground mb-1">
                💰 I see that <span className="font-bold">2.2 SOL (~$286)</span> just landed in your wallet.
              </p>
              <p className="text-xs text-muted-foreground">
                Want to use some of this deposit to get closer to your goal?
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <Button onClick={() => handleAddToGoal(50)} className="flex-1 action-button text-white">
          Add $50
        </Button>
        <Button onClick={() => handleAddToGoal(100)} className="flex-1 action-button text-white">
          Add $100
        </Button>
        <Button variant="outline" className="flex-1">
          No, thanks
        </Button>
      </div>
    </Card>
  );
};