import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, X } from 'lucide-react';
import { useState } from 'react';

export const YieldOpportunity = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <Card className="p-4 glass-card border-0 shadow-card bg-gradient-success/10 relative">
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 h-6 w-6"
        onClick={() => setIsVisible(false)}
      >
        <X className="w-4 h-4" />
      </Button>
      
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-success flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <p className="text-sm font-semibold text-success">Yield Opportunity</p>
        </div>
        
        <p className="text-sm leading-relaxed">
          The USDC-rUSD pool on Raydium is offering +3% APY on top of your normal savings. 
          Want me to move 25% of your savings there?
        </p>
        
        <div className="flex gap-2">
          <Button variant="success" size="sm" className="flex-1">
            Yes, optimize my yield
          </Button>
          <Button variant="outline" size="sm" onClick={() => setIsVisible(false)}>
            Not now
          </Button>
        </div>
      </div>
    </Card>
  );
};
