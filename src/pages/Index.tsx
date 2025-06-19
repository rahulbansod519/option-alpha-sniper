import { useState, useEffect } from 'react';
import { DashboardHeader } from '@/components/DashboardHeader';
import { MarketOverview } from '@/components/MarketOverview';
import { OptionChain } from '@/components/OptionChain';
import { TradingSignals } from '@/components/TradingSignals';
import { Portfolio } from '@/components/Portfolio';
import { RiskManagement } from '@/components/RiskManagement';
import { AngelOneAuth } from '@/components/AngelOneAuth';
import { useAngelOne } from '@/hooks/useAngelOne';

const Index = () => {
  const [selectedIndex, setSelectedIndex] = useState<'NIFTY' | 'BANKNIFTY'>('NIFTY');
  const [marketData, setMarketData] = useState({
    nifty: { price: 19650.25, change: 125.30, changePercent: 0.64 },
    banknifty: { price: 44850.75, change: -89.25, changePercent: -0.20 }
  });

  const { isAuthenticated } = useAngelOne();

  // Simulate real-time market data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMarketData(prev => ({
        nifty: {
          ...prev.nifty,
          price: prev.nifty.price + (Math.random() - 0.5) * 10,
          change: prev.nifty.change + (Math.random() - 0.5) * 2,
          changePercent: prev.nifty.changePercent + (Math.random() - 0.5) * 0.1
        },
        banknifty: {
          ...prev.banknifty,
          price: prev.banknifty.price + (Math.random() - 0.5) * 25,
          change: prev.banknifty.change + (Math.random() - 0.5) * 5,
          changePercent: prev.banknifty.changePercent + (Math.random() - 0.5) * 0.15
        }
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <DashboardHeader 
        selectedIndex={selectedIndex} 
        onIndexChange={setSelectedIndex}
        marketData={marketData}
      />
      
      <div className="container mx-auto px-4 py-6 space-y-6">
        {!isAuthenticated && (
          <AngelOneAuth />
        )}
        
        <MarketOverview 
          selectedIndex={selectedIndex}
          marketData={marketData}
        />
        
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-6">
            <OptionChain selectedIndex={selectedIndex} />
            <TradingSignals selectedIndex={selectedIndex} />
          </div>
          
          <div className="space-y-6">
            <Portfolio />
            <RiskManagement />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
