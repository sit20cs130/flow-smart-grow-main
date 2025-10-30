import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { ReflectService } from '@/lib/reflectService';
import { useState, useEffect } from 'react';

export const SmartSweepCard = () => {
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const [idleUSDC, setIdleUSDC] = useState(52.80);
  const [apy, setAPY] = useState(5.2);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkIdleUSDC = async () => {
      if (!publicKey) return;
      
      const reflectService = new ReflectService(connection);
      const balance = await reflectService.getIdleUSDC(publicKey);
      const currentAPY = await reflectService.getAPY();
      
      setIdleUSDC(balance);
      setAPY(currentAPY);
    };

    checkIdleUSDC();
  }, [publicKey, connection]);

  const handleSweep = async () => {
    if (!publicKey) {
      toast.error('Please connect your wallet first');
      return;
    }

    setIsLoading(true);
    toast.success(`Sweeping $${idleUSDC.toFixed(2)} into your savings...`);
    
    try {
      const reflectService = new ReflectService(connection);
      const result = await reflectService.prepareSweepTransaction(publicKey, idleUSDC);
      
      if (result.success) {
        setTimeout(() => {
          toast.success(`Done! Your $${idleUSDC.toFixed(2)} is now earning ${apy}% APY`);
        }, 2000);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Sweep error:', error);
      toast.error('Failed to sweep funds');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6 widget-card hover-scale">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-ai-bg flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-ai-blue" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-foreground mb-1">Smart Sweep Agent</h3>
          <p className="text-sm text-muted-foreground">
            Automatically move idle assets into interest-earning savings
          </p>
        </div>
      </div>

      <div className="bg-ai-bg/50 rounded-xl p-4 mb-4">
        <p className="text-sm text-foreground mb-3">
          💰 I noticed you have <span className="font-bold">${idleUSDC.toFixed(2)} in idle USDC</span> in your Phantom wallet.
        </p>
        <p className="text-sm text-muted-foreground mb-2">
          Want me to sweep it into your Flow savings? It can start earning <span className="text-action font-semibold">{apy}% APY</span> right away.
        </p>
        
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
          <TrendingUp className="w-4 h-4 text-action" />
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">Potential earnings/year</p>
            <p className="text-sm font-bold text-action">+${(idleUSDC * apy / 100).toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <Button onClick={handleSweep} disabled={isLoading || !publicKey} className="flex-1 action-button text-white">
          {isLoading ? 'Processing...' : 'Yes, sweep it'}
        </Button>
        <Button variant="outline" className="flex-1">
          Not right now
        </Button>
      </div>
    </Card>
  );
};