import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { QrCode, Coffee } from 'lucide-react';
import { toast } from 'sonner';

export const SolanaPayParserCard = () => {
  const [paymentUrl, setPaymentUrl] = useState('');
  const [parsedRequest, setParsedRequest] = useState<any>(null);

  const handleParse = () => {
    if (paymentUrl.includes('solana:')) {
      // Simulate parsing the Solana Pay URL
      setParsedRequest({
        recipient: 'COFFEE.sol',
        amount: 5.00,
        label: 'My Latte',
        merchant: 'The Coffee Shop'
      });
    }
  };

  const handlePay = () => {
    toast.success('Processing payment...');
    setTimeout(() => {
      toast.success('Paid! Enjoy your latte ☕');
      setParsedRequest(null);
      setPaymentUrl('');
    }, 2000);
  };

  return (
    <Card className="p-6 widget-card hover-scale">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-ai-bg flex items-center justify-center">
          <QrCode className="w-5 h-5 text-ai-blue" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-foreground mb-1">Solana Pay Parser Agent</h3>
          <p className="text-sm text-muted-foreground">
            Scan QR codes or paste payment links for seamless checkout
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex gap-2">
          <Input
            value={paymentUrl}
            onChange={(e) => setPaymentUrl(e.target.value)}
            placeholder="Paste Solana Pay URL here..."
            className="flex-1"
          />
          <Button onClick={handleParse} className="bg-ai-blue text-white">
            Parse
          </Button>
        </div>

        <Button
          variant="outline"
          className="w-full"
          onClick={() => setPaymentUrl('solana:pay?recipient=COFFEE.sol&amount=5&label=My%20Latte')}
        >
          Try Example URL
        </Button>

        {parsedRequest && (
          <div className="bg-ai-bg/50 rounded-xl p-4 animate-fade-in">
            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-border">
              <div className="w-12 h-12 rounded-full bg-action/10 flex items-center justify-center">
                <Coffee className="w-6 h-6 text-action" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground">{parsedRequest.merchant}</p>
                <p className="text-xs text-muted-foreground">{parsedRequest.recipient}</p>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">For:</span>
                <span className="text-sm font-semibold text-foreground">{parsedRequest.label}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Amount:</span>
                <span className="text-lg font-bold text-action">${parsedRequest.amount.toFixed(2)}</span>
              </div>
            </div>

            <p className="text-xs text-muted-foreground mb-3">
              I'll use your rUSD savings to pay. Ready?
            </p>

            <div className="flex gap-2">
              <Button onClick={handlePay} className="flex-1 action-button text-white">
                Confirm & Pay
              </Button>
              <Button onClick={() => setParsedRequest(null)} variant="outline" className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-3 text-xs text-muted-foreground">
        💡 Scan QR codes at coffee shops, restaurants, or paste payment links
      </div>
    </Card>
  );
};