
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Activity, Bell, Settings, User } from 'lucide-react';

interface DashboardHeaderProps {
  selectedIndex: 'NIFTY' | 'BANKNIFTY';
  onIndexChange: (index: 'NIFTY' | 'BANKNIFTY') => void;
  marketData: {
    nifty: { price: number; change: number; changePercent: number };
    banknifty: { price: number; change: number; changePercent: number };
  };
}

export const DashboardHeader = ({ selectedIndex, onIndexChange, marketData }: DashboardHeaderProps) => {
  const [isLive, setIsLive] = useState(true);

  return (
    <header className="bg-slate-900/95 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Activity className="h-8 w-8 text-emerald-400" />
              Smart Options Pro
            </h1>
            
            <div className="flex items-center gap-2">
              <Button
                variant={selectedIndex === 'NIFTY' ? 'default' : 'outline'}
                onClick={() => onIndexChange('NIFTY')}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                NIFTY
              </Button>
              <Button
                variant={selectedIndex === 'BANKNIFTY' ? 'default' : 'outline'}
                onClick={() => onIndexChange('BANKNIFTY')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                BANK NIFTY
              </Button>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm text-slate-400">NIFTY</div>
                <div className="flex items-center gap-2">
                  <span className="text-white font-semibold">{marketData.nifty.price.toFixed(2)}</span>
                  <span className={`flex items-center gap-1 text-sm ${marketData.nifty.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {marketData.nifty.change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {marketData.nifty.change.toFixed(2)} ({marketData.nifty.changePercent.toFixed(2)}%)
                  </span>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-sm text-slate-400">BANK NIFTY</div>
                <div className="flex items-center gap-2">
                  <span className="text-white font-semibold">{marketData.banknifty.price.toFixed(2)}</span>
                  <span className={`flex items-center gap-1 text-sm ${marketData.banknifty.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {marketData.banknifty.change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {marketData.banknifty.change.toFixed(2)} ({marketData.banknifty.changePercent.toFixed(2)}%)
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant={isLive ? 'default' : 'secondary'} className="bg-emerald-600">
                <div className={`w-2 h-2 rounded-full mr-1 ${isLive ? 'bg-emerald-300 animate-pulse' : 'bg-slate-400'}`} />
                {isLive ? 'LIVE' : 'OFFLINE'}
              </Badge>
              
              <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                <Settings className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                <User className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
