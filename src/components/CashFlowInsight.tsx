import { Card } from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';
import { useState, useEffect } from 'react';

const insights = [
  "You've earned $4.10 in interest this month just by holding your money here.",
  "Your top 'send' recipient this week was nft-marketplace.sol.",
  "You received 2.2 SOL from a new address. Want to move it into your savings?",
  "Your savings grew 0.4% this week—that's $2.15 earned passively.",
  "Smart move! Converting USDC to rUSD increased your yield by 5.2% APY."
];

export const CashFlowInsight = () => {
  const [currentInsight, setCurrentInsight] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentInsight((prev) => (prev + 1) % insights.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="p-4 glass-card border-0 shadow-card bg-gradient-primary/5">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center flex-shrink-0">
          <Lightbulb className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1">
          <p className="text-xs font-semibold text-primary mb-1">AI Insight</p>
          <p className="text-sm leading-relaxed">{insights[currentInsight]}</p>
        </div>
      </div>
    </Card>
  );
};
