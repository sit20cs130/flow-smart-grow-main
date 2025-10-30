import { useEffect, useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { Card } from '@/components/ui/card';
import { ConversationalAgent } from './ConversationalAgent';
import { SmartSweepCard } from './SmartSweepCard';
import { IntelligentPaymentCard } from './IntelligentPaymentCard';
import { GoalBasedAutoPayCard } from './GoalBasedAutoPayCard';
import { WalletHealthCard } from './WalletHealthCard';
import { SolanaPayParserCard } from './SolanaPayParserCard';
import { ThemeToggle } from './ThemeToggle';
import { Sparkles } from 'lucide-react';

export const Dashboard = () => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [balance, setBalance] = useState<number>(2.70);

  useEffect(() => {
    const fetchBalance = async () => {
      if (publicKey) {
        const lamports = await connection.getBalance(publicKey);
        setBalance(lamports / LAMPORTS_PER_SOL);
      }
    };

    fetchBalance();
    const interval = setInterval(fetchBalance, 10000);
    return () => clearInterval(interval);
  }, [publicKey, connection]);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Clean Header with Balance */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-ai-bg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-ai-blue" />
              </div>
              <h1 className="text-xl font-bold text-foreground">Flow</h1>
            </div>
            <Card className="bg-card border-border px-4 py-2 shadow-card">
              <p className="text-xs text-muted-foreground">Balance</p>
              <p className="text-2xl font-bold font-mono text-foreground">
                ${balance.toFixed(2)}
              </p>
            </Card>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <WalletMultiButton className="!bg-ai-blue !text-white !rounded-full" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Agent Feature Cards */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">AI Agent Features</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Smart agents working for you 24/7 to optimize your savings
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <SmartSweepCard />
            <IntelligentPaymentCard />
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <GoalBasedAutoPayCard />
            <WalletHealthCard />
          </div>
          
          <div className="grid md:grid-cols-1 gap-6">
            <SolanaPayParserCard />
          </div>
        </div>

        {/* AI Conversation Section */}
        <div className="border-t border-border pt-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">AI Assistant</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Chat with your personal financial assistant
          </p>
          <ConversationalAgent />
        </div>
      </div>
    </div>
  );
};
