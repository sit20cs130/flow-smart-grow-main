import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight, Repeat, Target } from 'lucide-react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

interface Action {
  id: string;
  label: string;
  icon: React.ReactNode;
  description: string;
}

export const ProactiveActions = () => {
  const actions: Action[] = [
    {
      id: '1',
      label: 'Send $20 to bob.sol again?',
      icon: <Repeat className="w-4 h-4" />,
      description: 'Recurring payment detected'
    },
    {
      id: '2',
      label: 'Swap idle 1.5 SOL for savings',
      icon: <ArrowRight className="w-4 h-4" />,
      description: 'Earn yield on $195'
    },
    {
      id: '3',
      label: 'Complete your Mint goal',
      icon: <Target className="w-4 h-4" />,
      description: 'Add last $10'
    }
  ];

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold px-1">AI Suggestions</h3>
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex gap-3 pb-4">
          {actions.map((action) => (
            <Card 
              key={action.id} 
              className="flex-shrink-0 w-64 p-4 cursor-pointer hover:shadow-card transition-shadow glass-card border-0"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center flex-shrink-0">
                  {action.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{action.label}</p>
                  <p className="text-xs text-muted-foreground">{action.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};
