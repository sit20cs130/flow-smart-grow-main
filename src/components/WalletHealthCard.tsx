import { Card } from '@/components/ui/card';
import { Calendar, TrendingUp, Send, Target } from 'lucide-react';

export const WalletHealthCard = () => {
  return (
    <Card className="p-6 widget-card hover-scale">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-ai-bg flex items-center justify-center">
          <Calendar className="w-5 h-5 text-ai-blue" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-foreground mb-1">Wallet Health Agent</h3>
          <p className="text-sm text-muted-foreground">
            Monthly financial summary and insights
          </p>
        </div>
      </div>

      <div className="bg-ai-bg/50 rounded-xl p-4 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl">🍂</span>
          <h4 className="font-semibold text-foreground">Happy November 1st!</h4>
        </div>
        
        <p className="text-sm text-muted-foreground mb-4">
          Here's your quick Flow report for October:
        </p>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-card rounded-lg p-3 border border-border">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-action" />
              <span className="text-xs text-muted-foreground">Interest Earned</span>
            </div>
            <p className="text-xl font-bold text-action">$12.34</p>
          </div>

          <div className="bg-card rounded-lg p-3 border border-border">
            <div className="flex items-center gap-2 mb-1">
              <Target className="w-4 h-4 text-ai-blue" />
              <span className="text-xs text-muted-foreground">Total Saved</span>
            </div>
            <p className="text-xl font-bold text-foreground">$100.00</p>
          </div>

          <div className="bg-card rounded-lg p-3 border border-border">
            <div className="flex items-center gap-2 mb-1">
              <Send className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Total Sent</span>
            </div>
            <p className="text-xl font-bold text-foreground">$80.00</p>
            <p className="text-xs text-muted-foreground">in 2 payments</p>
          </div>

          <div className="bg-card rounded-lg p-3 border border-border">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-action" />
              <span className="text-xs text-muted-foreground">This Month</span>
            </div>
            <p className="text-xl font-bold text-action">~$12.50</p>
          </div>
        </div>
      </div>

      <p className="text-xs text-muted-foreground text-center">
        You're on track! No action needed, just wanted to share 💚
      </p>
    </Card>
  );
};