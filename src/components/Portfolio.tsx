
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Wallet, TrendingUp, TrendingDown, PieChart, DollarSign } from 'lucide-react';

interface Position {
  id: string;
  instrument: string;
  strike: number;
  optionType: 'CE' | 'PE';
  quantity: number;
  avgPrice: number;
  ltp: number;
  pnl: number;
  pnlPercent: number;
}

export const Portfolio = () => {
  const [positions, setPositions] = useState<Position[]>([
    {
      id: '1',
      instrument: 'NIFTY',
      strike: 19650,
      optionType: 'CE',
      quantity: 25,
      avgPrice: 85.50,
      ltp: 92.30,
      pnl: 170,
      pnlPercent: 7.95
    },
    {
      id: '2',
      instrument: 'BANKNIFTY',
      strike: 44800,
      optionType: 'PE',
      quantity: 15,
      avgPrice: 120.75,
      ltp: 108.20,
      pnl: -188.25,
      pnlPercent: -10.40
    },
    {
      id: '3',
      instrument: 'NIFTY',
      strike: 19700,
      optionType: 'CE',
      quantity: 50,
      avgPrice: 45.30,
      ltp: 58.80,
      pnl: 675,
      pnlPercent: 29.80
    }
  ]);

  const [portfolioStats, setPortfolioStats] = useState({
    totalValue: 0,
    totalPnL: 0,
    dayPnL: 0,
    invested: 0
  });

  useEffect(() => {
    // Update LTP periodically
    const interval = setInterval(() => {
      setPositions(prev => prev.map(pos => {
        const newLtp = pos.ltp + (Math.random() - 0.5) * 5;
        const newPnl = (newLtp - pos.avgPrice) * pos.quantity;
        const newPnlPercent = ((newLtp - pos.avgPrice) / pos.avgPrice) * 100;
        
        return {
          ...pos,
          ltp: Math.max(0.05, newLtp),
          pnl: newPnl,
          pnlPercent: newPnlPercent
        };
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const totalInvested = positions.reduce((sum, pos) => sum + (pos.avgPrice * pos.quantity), 0);
    const totalValue = positions.reduce((sum, pos) => sum + (pos.ltp * pos.quantity), 0);
    const totalPnL = positions.reduce((sum, pos) => sum + pos.pnl, 0);
    
    setPortfolioStats({
      totalValue,
      totalPnL,
      dayPnL: totalPnL * 0.7, // Simulated day PnL
      invested: totalInvested
    });
  }, [positions]);

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          Portfolio
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Portfolio Summary */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-700/50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <DollarSign className="h-4 w-4 text-blue-400" />
                <span className="text-xs text-slate-400">Total Value</span>
              </div>
              <div className="text-lg font-semibold text-white">
                ₹{portfolioStats.totalValue.toFixed(2)}
              </div>
            </div>
            
            <div className="bg-slate-700/50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <PieChart className="h-4 w-4 text-emerald-400" />
                <span className="text-xs text-slate-400">Total P&L</span>
              </div>
              <div className={`text-lg font-semibold ${portfolioStats.totalPnL >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {portfolioStats.totalPnL >= 0 ? '+' : ''}₹{portfolioStats.totalPnL.toFixed(2)}
              </div>
            </div>
          </div>

          {/* Positions */}
          <div className="space-y-3">
            <div className="text-sm text-slate-400 font-medium">Open Positions</div>
            {positions.map((position) => (
              <div key={position.id} className="bg-slate-700/30 rounded-lg p-3 border border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium">
                      {position.instrument} {position.strike} {position.optionType}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      Qty: {position.quantity}
                    </Badge>
                  </div>
                  <div className={`flex items-center gap-1 ${position.pnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {position.pnl >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    <span className="text-sm font-semibold">
                      {position.pnl >= 0 ? '+' : ''}₹{position.pnl.toFixed(2)}
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <div className="text-slate-400">Avg Price</div>
                    <div className="text-white">₹{position.avgPrice.toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="text-slate-400">LTP</div>
                    <div className="text-white">₹{position.ltp.toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="text-slate-400">Returns</div>
                    <div className={position.pnlPercent >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                      {position.pnlPercent >= 0 ? '+' : ''}{position.pnlPercent.toFixed(2)}%
                    </div>
                  </div>
                </div>
                
                <Progress 
                  value={Math.abs(position.pnlPercent)} 
                  className="h-1 mt-2" 
                />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
