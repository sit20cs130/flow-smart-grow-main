import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Bot, User, Sparkles, TrendingUp, Target, DollarSign, Calendar, ArrowUpRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  actions?: MessageAction[];
  widget?: WidgetType;
  widgetData?: any;
  timestamp?: Date;
}

interface MessageAction {
  label: string;
  type: 'sweep' | 'send' | 'swap' | 'goal' | 'pay';
  data?: any;
}

type WidgetType = 'goal' | 'earnings' | 'health' | 'payment-request' | 'sweep';

export const ConversationalAgent = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Good morning! 👋 I'm Flow, your personal savings assistant.",
      timestamp: new Date()
    },
    {
      role: 'assistant',
      content: "I noticed you have $52.80 in 'idle' USDC in your Phantom wallet. Want me to 'sweep' it into your Flow savings? It can start earning 5.2% APY for you right away.",
      actions: [
        { label: 'Yes, sweep it', type: 'sweep', data: { amount: 52.80 } },
        { label: 'Not right now', type: 'sweep' }
      ],
      widget: 'sweep',
      widgetData: { amount: 52.80, asset: 'USDC', apy: 5.2 },
      timestamp: new Date()
    },
    {
      role: 'assistant',
      content: "Based on your current balance, you're on track to earn $0.14 this month. Your money is working for you!",
      widget: 'earnings',
      widgetData: { current: 2.70, projected: 0.14, apy: 5.2 },
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleAction = async (action: MessageAction) => {
    const actionMessages: Record<string, string> = {
      sweep: action.label === 'Yes, sweep it' 
        ? `Great! Sweeping $${action.data?.amount} into your savings...` 
        : "No problem! I'll remind you later.",
      send: "Starting the transfer now...",
      swap: "Building your swap transaction...",
      goal: "Setting up your savings goal!",
      pay: "Processing your payment..."
    };

    const responseMessage = actionMessages[action.type] || "Processing your request...";
    
    setMessages(prev => [...prev, {
      role: 'user',
      content: action.label,
      timestamp: new Date()
    }]);

    // Simulate processing delay
    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: responseMessage,
        timestamp: new Date()
      }]);
      
      if (action.label.includes('Yes')) {
        toast.success(action.label);
      }
    }, 500);
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage, timestamp: new Date() }]);
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('chat', {
        body: { message: userMessage }
      });

      if (error) throw error;

      const responseContent = data.response || "Sorry, I couldn't process that request.";
      
      const newMessage: Message = {
        role: 'assistant',
        content: responseContent,
        timestamp: new Date()
      };

      // Parse for contextual actions and widgets
      const lowerContent = responseContent.toLowerCase();
      
      if (lowerContent.includes('goal') && lowerContent.includes('laptop')) {
        newMessage.widget = 'goal';
        newMessage.widgetData = { name: 'New Laptop', current: 850, target: 1500 };
      } else if (lowerContent.includes('sweep') || lowerContent.includes('idle')) {
        newMessage.actions = [
          { label: 'Yes, sweep it', type: 'sweep' },
          { label: 'Not right now', type: 'sweep' }
        ];
      } else if (lowerContent.includes('pay') && lowerContent.includes('bob')) {
        newMessage.widget = 'payment-request';
        newMessage.widgetData = { 
          recipient: 'bob.sol', 
          amount: 20, 
          purpose: 'dinner',
          steps: [
            { action: 'Send $20 to bob.sol' },
            { action: 'Swap ~$130 for 1 SOL' }
          ]
        };
        newMessage.actions = [
          { label: 'Yes, proceed', type: 'send' },
          { label: 'Cancel', type: 'send' }
        ];
      } else if (lowerContent.includes('report') || lowerContent.includes('earned')) {
        newMessage.widget = 'health';
        newMessage.widgetData = {
          month: 'October',
          earned: 12.34,
          saved: 100,
          sent: 80,
          payments: 2,
          forecast: 12.50
        };
      }

      setMessages(prev => [...prev, newMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderWidget = (widget: WidgetType, data: any) => {
    switch (widget) {
      case 'sweep':
        return (
          <Card className="p-4 mt-3 widget-card animate-fade-in">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground mb-1">Idle Assets Found</p>
                <p className="text-xs text-muted-foreground mb-2">${data.amount.toFixed(2)} {data.asset} sitting idle</p>
              </div>
              <Sparkles className="w-5 h-5 text-ai-blue" />
            </div>
            <div className="bg-ai-bg/50 rounded-lg p-3 mt-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Potential APY</span>
                <span className="font-semibold text-action">{data.apy}%</span>
              </div>
            </div>
          </Card>
        );
      
      case 'earnings':
        return (
          <Card className="p-4 mt-3 widget-card animate-fade-in">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-ai-blue" />
              <span className="text-sm font-semibold">Earnings Forecast</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Current Balance</span>
                <span className="font-mono">${data.current.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">APY</span>
                <span className="text-action font-semibold">{data.apy}%</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Projected This Month</span>
                <span className="font-mono text-action font-semibold">+${data.projected.toFixed(2)}</span>
              </div>
            </div>
          </Card>
        );
      
      case 'goal':
        return (
          <Card className="p-4 mt-3 widget-card animate-fade-in">
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-4 h-4 text-ai-blue" />
              <span className="text-sm font-semibold">{data.name}</span>
            </div>
            <Progress value={(data.current / data.target) * 100} className="h-2 mb-2" />
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">${data.current.toFixed(2)} / ${data.target.toFixed(2)}</span>
              <span className="text-ai-blue font-semibold">{Math.round((data.current / data.target) * 100)}% complete</span>
            </div>
          </Card>
        );
      
      case 'payment-request':
        return (
          <Card className="p-4 mt-3 widget-card animate-fade-in">
            <div className="flex items-center gap-2 mb-3">
              <DollarSign className="w-4 h-4 text-ai-blue" />
              <span className="text-sm font-semibold">Payment Plan</span>
            </div>
            <div className="space-y-2">
              {data.steps.map((step: any, idx: number) => (
                <div key={idx} className="flex items-center gap-2 text-xs">
                  <div className="w-5 h-5 rounded-full bg-ai-bg flex items-center justify-center text-ai-blue font-semibold">
                    {idx + 1}
                  </div>
                  <span className="text-muted-foreground">{step.action}</span>
                </div>
              ))}
            </div>
          </Card>
        );
      
      case 'health':
        return (
          <Card className="p-4 mt-3 widget-card animate-fade-in">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-4 h-4 text-ai-blue" />
              <span className="text-sm font-semibold">{data.month} Report</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-muted-foreground">Interest Earned</p>
                <p className="text-lg font-bold text-action">+${data.earned.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Saved</p>
                <p className="text-lg font-bold">${data.saved.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Sent</p>
                <p className="text-lg font-bold">${data.sent.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">This Month</p>
                <p className="text-lg font-bold text-action">~${data.forecast.toFixed(2)}</p>
              </div>
            </div>
          </Card>
        );
      
      default:
        return null;
    }
  };

  return (
    <Card className="widget-card">
      <ScrollArea className="h-[500px] p-4" ref={scrollRef}>
        <div className="space-y-4 pb-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-3 animate-fade-in ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                msg.role === 'user' 
                  ? 'bg-user-gray' 
                  : 'bg-ai-bg'
              }`}>
                {msg.role === 'user' ? (
                  <User className="w-4 h-4 text-foreground" />
                ) : (
                  <Bot className="w-5 h-5 text-ai-blue" />
                )}
              </div>
              <div className={`flex-1 max-w-[85%] ${msg.role === 'user' ? 'text-right' : ''}`}>
                <div className={`inline-block p-4 ${
                  msg.role === 'user' 
                    ? 'chat-bubble-user' 
                    : 'chat-bubble-ai'
                }`}>
                  <p className="text-sm leading-relaxed text-foreground">{msg.content}</p>
                  {msg.widget && renderWidget(msg.widget, msg.widgetData)}
                  {msg.actions && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {msg.actions.map((action, actionIdx) => (
                        <Button
                          key={actionIdx}
                          size="sm"
                          onClick={() => handleAction(action)}
                          className={actionIdx === 0 
                            ? "action-button text-white" 
                            : "bg-card border border-border hover:bg-muted"
                          }
                        >
                          {action.label}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3 animate-fade-in">
              <div className="w-9 h-9 rounded-full bg-ai-bg flex items-center justify-center">
                <Bot className="w-5 h-5 text-ai-blue" />
              </div>
              <div className="chat-bubble-ai p-4">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-ai-blue rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-ai-blue rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 bg-ai-blue rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-border">
        <form 
          onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
          className="flex gap-2"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type anything or paste a Solana Pay link..."
            disabled={isLoading}
            className="flex-1 bg-card border-border text-foreground placeholder:text-muted-foreground rounded-full px-5"
          />
          <Button 
            type="submit" 
            size="icon"
            disabled={isLoading || !input.trim()}
            className="action-button text-white rounded-full h-11 w-11"
          >
            <Send className="w-5 h-5" />
          </Button>
        </form>
      </div>
    </Card>
  );
};