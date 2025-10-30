import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Brain, Send } from 'lucide-react';
import { toast } from 'sonner';

export const IntelligentPaymentCard = () => {
  const [command, setCommand] = useState('');
  const [showPlan, setShowPlan] = useState(false);

  const handleParse = () => {
    if (command.trim()) {
      setShowPlan(true);
    }
  };

  const handleExecute = () => {
    toast.success('Processing your payment plan...');
    setTimeout(() => {
      toast.success('All set! Bob is paid, and you have 1 SOL in your wallet');
      setShowPlan(false);
      setCommand('');
    }, 2000);
  };

  return (
    <Card className="p-6 widget-card hover-scale">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-ai-bg flex items-center justify-center">
          <Brain className="w-5 h-5 text-ai-blue" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-foreground mb-1">Intelligent Payment Agent</h3>
          <p className="text-sm text-muted-foreground">
            Parse complex commands and execute multi-step transactions
          </p>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex gap-2">
          <Input
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            placeholder='Try: "Pay bob.sol $20 and get me 1 SOL"'
            className="flex-1"
          />
          <Button onClick={handleParse} size="icon" className="bg-ai-blue text-white">
            <Send className="w-4 h-4" />
          </Button>
        </div>

        {showPlan && (
          <div className="bg-ai-bg/50 rounded-xl p-4 animate-fade-in">
            <p className="text-sm font-semibold text-foreground mb-3">
              Got it! I can do both as a 2-step plan:
            </p>
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-ai-blue text-white flex items-center justify-center text-xs font-bold">
                  1
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">Send:</span>{' '}
                  <span className="font-semibold">$20.00 to bob.sol</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-ai-blue text-white flex items-center justify-center text-xs font-bold">
                  2
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">Swap:</span>{' '}
                  <span className="font-semibold">~$130.00 for 1 SOL</span>
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              I'll use your interest-earning rUSD for both. Sound good?
            </p>
            <div className="flex gap-2">
              <Button onClick={handleExecute} className="flex-1 action-button text-white">
                Yes, proceed
              </Button>
              <Button onClick={() => setShowPlan(false)} variant="outline" className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="text-xs text-muted-foreground">
        💡 Try complex commands like "Send $X to [address] and swap Y SOL"
      </div>
    </Card>
  );
};