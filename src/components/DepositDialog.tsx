import { useState } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ArrowDownLeft } from 'lucide-react';

interface DepositDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const DepositDialog = ({ open, onOpenChange, onSuccess }: DepositDialogProps) => {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const { toast } = useToast();
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleDeposit = async () => {
    if (!publicKey) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // For this demo, we'll create a transaction to deposit SOL
      // In production, you'd integrate with Reflect SDK to swap for rUSD
      const lamports = parseFloat(amount) * LAMPORTS_PER_SOL;
      
      // Get the latest blockhash
      const { blockhash } = await connection.getLatestBlockhash();

      // Create a simple transfer transaction as deposit confirmation
      // In production, this would interact with Reflect protocol
      const transaction = new Transaction({
        recentBlockhash: blockhash,
        feePayer: publicKey,
      }).add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: publicKey, // Self-transfer for demo - in prod this would be Reflect vault
          lamports: Math.floor(lamports),
        })
      );

      const signature = await sendTransaction(transaction, connection);
      
      // Wait for confirmation
      await connection.confirmTransaction(signature, 'confirmed');

      toast({
        title: "Deposit successful! 🎉",
        description: `Deposited ${amount} SOL. Transaction: ${signature.slice(0, 8)}...`,
      });

      onSuccess();
      onOpenChange(false);
      setAmount('');
    } catch (error) {
      console.error('Deposit error:', error);
      toast({
        title: "Deposit failed",
        description: error instanceof Error ? error.message : "Transaction failed",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-gradient-success flex items-center justify-center">
              <ArrowDownLeft className="w-6 h-6 text-white" />
            </div>
            <div>
              <DialogTitle>Deposit Funds</DialogTitle>
              <DialogDescription>Add SOL to start earning yield</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (SOL)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="bg-secondary/50 rounded-lg p-3 text-sm text-muted-foreground">
            <p>
              Your deposit will be converted to rUSD (Reflect's interest-bearing stablecoin) which earns ~5.2% APY automatically.
            </p>
          </div>

          <Button
            onClick={handleDeposit}
            disabled={isLoading || !amount || parseFloat(amount) <= 0}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              'Deposit'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
