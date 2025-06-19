import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, BarChart3, Target, Zap } from 'lucide-react';
import { useAngelOne } from '@/hooks/useAngelOne';

interface MarketOverviewProps {
  selectedIndex: 'NIFTY' | 'BANKNIFTY';
  marketData: {
    nifty: { price: number; change: number; changePercent: number };
    banknifty: { price: number; change: number; changePercent: number };
  };
  onMarketDataUpdate: (data: any) => void;
}

export const MarketOverview = ({ selectedIndex, marketData, onMarketDataUpdate }: MarketOverviewProps) => {
  const [technicals, setTechnicals] = useState({
    rsi: 58.4,
    macd: 2.3,
    volatility: 15.2,
    trend: 'Bullish'
  });

  const { getMarketData, isAuthenticated } = useAngelOne();

  const currentData = marketData[selectedIndex.toLowerCase() as keyof typeof marketData];

  // Fetch real market data
  useEffect(() => {
    const fetchRealData = async () => {
      if (!isAuthenticated) return;

      try {
        // NIFTY 50 data
        const niftyData = await getMarketData('NSE', 'NIFTY 50', '99926000');
        // Bank Nifty data
        const bankNiftyData = await getMarketData('NSE', 'NIFTY BANK', '99926009');

        if (niftyData?.data && bankNiftyData?.data) {
          const newMarketData = {
            nifty: {
              price: parseFloat(niftyData.data.ltp) || marketData.nifty.price,
              change: parseFloat(niftyData.data.netChg) || marketData.nifty.change,
              changePercent: parseFloat(niftyData.data.prcntChg) || marketData.nifty.changePercent
            },
            banknifty: {
              price: parseFloat(bankNiftyData.data.ltp) || marketData.banknifty.price,
              change: parseFloat(bankNiftyData.data.netChg) || marketData.banknifty.change,
              changePercent: parseFloat(bankNiftyData.data.prcntChg) || marketData.banknifty.changePercent
            }
          };
          onMarketDataUpdate(newMarketData);
        }
      } catch (error) {
        console.error('Error fetching market data:', error);
      }
    };

    fetchRealData();
    const interval = setInterval(fetchRealData, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [isAuthenticated, getMarketData, onMarketDataUpdate]);

  // Update technicals based on price movements
  useEffect(() => {
    const interval = setInterval(() => {
      setTechnicals(prev => ({
        rsi: Math.max(20, Math.min(80, prev.rsi + (Math.random() - 0.5) * 2)),
        macd: prev.macd + (Math.random() - 0.5) * 0.5,
        volatility: Math.max(10, Math.min(25, prev.volatility + (Math.random() - 0.5) * 1)),
        trend: prev.rsi > 60 ? 'Bullish' : prev.rsi < 40 ? 'Bearish' : 'Neutral'
      }));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const getRSIColor = (rsi: number) => {
    if (rsi > 70) return 'text-red-400';
    if (rsi < 30) return 'text-emerald-400';
    return 'text-yellow-400';
  };

  const getTrendColor = (trend: string) => {
    if (trend === 'Bullish') return 'text-emerald-400';
    if (trend === 'Bearish') return 'text-red-400';
    return 'text-yellow-400';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-slate-300 text-sm flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Current Price
            {!isAuthenticated && <span className="text-xs text-yellow-400">(Demo)</span>}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white mb-1">
            ₹{currentData.price.toFixed(2)}
          </div>
          <div className={`flex items-center gap-1 text-sm ${currentData.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {currentData.change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {currentData.change.toFixed(2)} ({currentData.changePercent.toFixed(2)}%)
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-slate-300 text-sm flex items-center gap-2">
            <Target className="h-4 w-4" />
            RSI (14)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold mb-2 ${getRSIColor(technicals.rsi)}`}>
            {technicals.rsi.toFixed(1)}
          </div>
          <Progress 
            value={technicals.rsi} 
            className="h-2" 
          />
          <div className="text-xs text-slate-400 mt-1">
            {technicals.rsi > 70 ? 'Overbought' : technicals.rsi < 30 ? 'Oversold' : 'Neutral'}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-slate-300 text-sm flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Volatility
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-400 mb-2">
            {technicals.volatility.toFixed(1)}%
          </div>
          <Progress 
            value={(technicals.volatility / 25) * 100} 
            className="h-2" 
          />
          <div className="text-xs text-slate-400 mt-1">
            {technicals.volatility > 20 ? 'High' : technicals.volatility > 15 ? 'Medium' : 'Low'}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-slate-300 text-sm flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Market Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold mb-2 ${getTrendColor(technicals.trend)}`}>
            {technicals.trend}
          </div>
          <div className="text-xs text-slate-400">
            MACD: {technicals.macd.toFixed(2)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
