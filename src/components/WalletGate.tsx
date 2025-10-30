import { FC, ReactNode } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Wallet, Lock } from 'lucide-react';

interface WalletGateProps {
  children: ReactNode;
}

export const WalletGate: FC<WalletGateProps> = ({ children }) => {
  const { connected } = useWallet();

  if (!connected) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-hero p-4">
        <div className="max-w-md w-full space-y-8 text-center">
          <div className="glass-card rounded-3xl p-8 space-y-6">
            <div className="mx-auto w-20 h-20 rounded-full bg-gradient-primary flex items-center justify-center">
              <Wallet className="w-10 h-10 text-white" />
            </div>
            
            <div className="space-y-3">
              <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Welcome to Flow
              </h1>
              <p className="text-muted-foreground text-lg">
                Your AI-Powered Smart Savings on Solana
              </p>
            </div>

            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-3 text-left p-3 rounded-lg bg-secondary/50">
                <Lock className="w-5 h-5 text-primary flex-shrink-0" />
                <p className="text-sm text-muted-foreground">
                  Connect your Phantom wallet to access your savings
                </p>
              </div>

              <WalletMultiButton className="!bg-gradient-primary hover:opacity-90 !rounded-xl !h-14 !text-base font-semibold w-full transition-all" />
            </div>

            <p className="text-xs text-muted-foreground pt-4">
              New to Solana? Download Phantom wallet to get started
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
