
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { TrendingUp, TrendingDown, Zap, Target, AlertTriangle, CheckCircle } from 'lucide-react';

interface TradingSignalsProps {
  selectedIndex: 'NIFTY' | 'BANKNIFTY';
}

interface Signal {
  id: string;
  type: 'BUY' | 'SELL';
  instrument: string;
  strike: number;
  optionType: 'CE' | 'PE';
  price: number;
  target: number;
  stopLoss: number;
  confidence: number;
  timeGenerated: string;
  status: 'ACTIVE' | 'HIT_TARGET' | 'HIT_SL' | 'EXPIRED';
  reason: string;
}

export const TradingSignals = ({ selectedIndex }: TradingSignalsProps) => {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [liveSignal, setLiveSignal] = useState<Signal | null>(null);

  useEffect(() => {
    // Generate initial signals
    const generateSignal = (): Signal => {
      const basePrice = selectedIndex === 'NIFTY' ? 19650 : 44850;
      const strikeInterval = selectedIndex === 'NIFTY' ? 50 : 100;
      const isBuy = Math.random() > 0.5;
      const isCall = Math.random() > 0.5;
      const strike = Math.round((basePrice + (Math.random() - 0.5) * strikeInterval * 6) / strikeInterval) * strikeInterval;
      const price = 20 + Math.random() * 100;
      
      return {
        id: Math.random().toString(36).substr(2, 9),
        type: isBuy ? 'BUY' : 'SELL',
        instrument: selectedIndex,
        strike,
        optionType: isCall ? 'CE' : 'PE',
        price,
        target: price * (1 + 0.2 + Math.random() * 0.3),
        stopLoss: price * (0.7 + Math.random() * 0.2),
        confidence: 70 + Math.random() * 25,
        timeGenerated: new Date().toLocaleTimeString(),
        status: 'ACTIVE',
        reason: isCall ? 'Bullish momentum detected with RSI oversold' : 'Bearish divergence with high volatility'
      };
    };

    setSignals([generateSignal(), generateSignal(), generateSignal()]);
    
    // Generate live signals periodically
    const interval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance every 5 seconds
        const newSignal = generateSignal();
        setLiveSignal(newSignal);
        setSignals(prev => [newSignal, ...prev.slice(0, 4)]);
        
        // Clear live signal after 3 seconds
        setTimeout(() => setLiveSignal(null), 3000);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [selectedIndex]);

  const getSignalColor = (type: string) => {
    return type === 'BUY' ? 'text-emerald-400' : 'text-red-400';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'HIT_TARGET': return 'bg-emerald-600';
      case 'HIT_SL': return 'bg-red-600';
      case 'EXPIRED': return 'bg-slate-600';
      default: return 'bg-blue-600';
    }
  };

  return (
    <div className="space-y-4">
      {liveSignal && (
        <Alert className="bg-gradient-to-r from-emerald-900/50 to-blue-900/50 border-emerald-500 animate-pulse">
          <Zap className="h-4 w-4 text-emerald-400" />
          <AlertDescription className="text-white">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-emerald-400">NEW SIGNAL!</span> {liveSignal.type} {liveSignal.instrument} {liveSignal.strike} {liveSignal.optionType} @ ₹{liveSignal.price.toFixed(2)}
              </div>
              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                Execute
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Target className="h-5 w-5" />
            Smart Trading Signals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {signals.map((signal) => (
              <div key={signal.id} className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Badge className={`${signal.type === 'BUY' ? 'bg-emerald-600' : 'bg-red-600'} text-white`}>
                      {signal.type}
                    </Badge>
                    <span className="text-white font-semibold">
                      {signal.instrument} {signal.strike} {signal.optionType}
                    </span>
                    <Badge className={getStatusColor(signal.status)}>
                      {signal.status}
                    </Badge>
                  </div>
                  <div className="text-sm text-slate-400">
                    {signal.timeGenerated}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                  <div>
                    <div className="text-xs text-slate-400">Entry Price</div>
                    <div className="text-white font-semibold">₹{signal.price.toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">Target</div>
                    <div className="text-emerald-400 font-semibold">₹{signal.target.toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">Stop Loss</div>
                    <div className="text-red-400 font-semibold">₹{signal.stopLoss.toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">Confidence</div>
                    <div className="text-yellow-400 font-semibold">{signal.confidence.toFixed(0)}%</div>
                  </div>
                </div>
                
                <div className="mb-3">
                  <div className="text-xs text-slate-400 mb-1">Reason</div>
                  <div className="text-sm text-slate-300">{signal.reason}</div>
                </div>
                
                <div className="flex gap-2">
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    Execute Trade
                  </Button>
                  <Button size="sm" variant="outline" className="border-slate-600">
                    Set Alert
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
