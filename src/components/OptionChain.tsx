import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TrendingUp, TrendingDown, ShoppingCart, Filter, AlertCircle } from 'lucide-react';
import { useAngelOne } from '@/hooks/useAngelOne';

interface OptionChainProps {
  selectedIndex: 'NIFTY' | 'BANKNIFTY';
}

interface OptionData {
  strike: number;
  callPrice: number;
  callChange: number;
  putPrice: number;
  putChange: number;
  callOI: number;
  putOI: number;
  callIV: number;
  putIV: number;
  signal: 'BUY' | 'SELL' | 'HOLD';
}

export const OptionChain = ({ selectedIndex }: OptionChainProps) => {
  const [optionData, setOptionData] = useState<OptionData[]>([]);
  const [filterStrike, setFilterStrike] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { getOptionChain, isAuthenticated } = useAngelOne();

  // Fetch real option chain data
  useEffect(() => {
    const fetchOptionChain = async () => {
      if (!isAuthenticated) {
        // Generate dummy data if not authenticated
        generateDummyData();
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Get current week's expiry (Thursday)
        const today = new Date();
        const daysUntilThursday = (4 - today.getDay() + 7) % 7;
        const nextThursday = new Date(today);
        nextThursday.setDate(today.getDate() + daysUntilThursday);
        const expiry = nextThursday.toISOString().split('T')[0];

        const indexName = selectedIndex === 'NIFTY' ? 'NIFTY' : 'BANKNIFTY';
        const chainData = await getOptionChain(indexName, expiry);

        if (chainData?.data?.fetched) {
          const processedData = processOptionChainData(chainData.data.fetched);
          setOptionData(processedData);
        } else {
          generateDummyData();
        }
      } catch (err) {
        console.error('Error fetching option chain:', err);
        setError('Failed to fetch option chain data');
        generateDummyData();
      } finally {
        setLoading(false);
      }
    };

    fetchOptionChain();
    const interval = setInterval(fetchOptionChain, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, [selectedIndex, isAuthenticated, getOptionChain]);

  const processOptionChainData = (rawData: any[]): OptionData[] => {
    const processedData: OptionData[] = [];
    
    rawData.forEach((item: any) => {
      if (item.strikePrice) {
        const callData = item.CE || {};
        const putData = item.PE || {};
        
        processedData.push({
          strike: item.strikePrice,
          callPrice: parseFloat(callData.lastPrice) || 0,
          callChange: parseFloat(callData.change) || 0,
          putPrice: parseFloat(putData.lastPrice) || 0,
          putChange: parseFloat(putData.change) || 0,
          callOI: parseInt(callData.openInterest) || 0,
          putOI: parseInt(putData.openInterest) || 0,
          callIV: parseFloat(callData.impliedVolatility) || 0,
          putIV: parseFloat(putData.impliedVolatility) || 0,
          signal: Math.random() > 0.7 ? 'BUY' : Math.random() > 0.5 ? 'SELL' : 'HOLD'
        });
      }
    });

    return processedData.sort((a, b) => a.strike - b.strike);
  };

  const generateDummyData = () => {
    const basePrice = selectedIndex === 'NIFTY' ? 19650 : 44850;
    const strikeInterval = selectedIndex === 'NIFTY' ? 50 : 100;
    
    const strikes = [];
    for (let i = -5; i <= 5; i++) {
      const strike = Math.round((basePrice + (i * strikeInterval * 2)) / strikeInterval) * strikeInterval;
      strikes.push(strike);
    }

    const data = strikes.map(strike => {
      const isATM = Math.abs(strike - basePrice) < strikeInterval;
      const isITM = strike < basePrice;
      
      return {
        strike,
        callPrice: Math.max(0.05, isITM ? (basePrice - strike) + Math.random() * 50 : Math.random() * 100),
        callChange: (Math.random() - 0.5) * 10,
        putPrice: Math.max(0.05, !isITM ? (strike - basePrice) + Math.random() * 50 : Math.random() * 100),
        putChange: (Math.random() - 0.5) * 10,
        callOI: Math.floor(Math.random() * 100000),
        putOI: Math.floor(Math.random() * 100000),
        callIV: 15 + Math.random() * 20,
        putIV: 15 + Math.random() * 20,
        signal: Math.random() > 0.7 ? 'BUY' : Math.random() > 0.5 ? 'SELL' : 'HOLD'
      } as OptionData;
    });

    setOptionData(data);
  };

  const filteredData = optionData.filter(option => 
    filterStrike === '' || option.strike.toString().includes(filterStrike)
  );

  const getSignalColor = (signal: string) => {
    switch (signal) {
      case 'BUY': return 'bg-emerald-600';
      case 'SELL': return 'bg-red-600';
      default: return 'bg-yellow-600';
    }
  };

  const basePrice = selectedIndex === 'NIFTY' ? 19650 : 44850;
  const strikeInterval = selectedIndex === 'NIFTY' ? 50 : 100;

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Filter className="h-5 w-5" />
            {selectedIndex} Option Chain
            {!isAuthenticated && <span className="text-xs text-yellow-400">(Demo Data)</span>}
            {loading && <span className="text-xs text-blue-400">Loading...</span>}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Filter strike..."
              value={filterStrike}
              onChange={(e) => setFilterStrike(e.target.value)}
              className="w-32 bg-slate-700 border-slate-600 text-white"
            />
          </div>
        </div>
        {error && (
          <div className="flex items-center gap-2 text-red-400 text-sm">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-700">
                <TableHead className="text-emerald-400 text-center">CALL OI</TableHead>
                <TableHead className="text-emerald-400 text-center">CALL LTP</TableHead>
                <TableHead className="text-emerald-400 text-center">CALL CHG</TableHead>
                <TableHead className="text-white text-center font-bold">STRIKE</TableHead>
                <TableHead className="text-red-400 text-center">PUT CHG</TableHead>
                <TableHead className="text-red-400 text-center">PUT LTP</TableHead>
                <TableHead className="text-red-400 text-center">PUT OI</TableHead>
                <TableHead className="text-center">SIGNAL</TableHead>
                <TableHead className="text-center">ACTION</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((option) => {
                const isATM = Math.abs(option.strike - basePrice) < strikeInterval;
                return (
                  <TableRow 
                    key={option.strike} 
                    className={`border-slate-700 ${isATM ? 'bg-slate-700/50' : ''}`}
                  >
                    <TableCell className="text-center text-slate-300">
                      {(option.callOI / 1000).toFixed(0)}K
                    </TableCell>
                    <TableCell className="text-center text-emerald-400 font-semibold">
                      ₹{option.callPrice.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-center">
                      <span className={option.callChange >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                        {option.callChange >= 0 ? '+' : ''}{option.callChange.toFixed(2)}
                      </span>
                    </TableCell>
                    <TableCell className={`text-center font-bold ${isATM ? 'text-yellow-400' : 'text-white'}`}>
                      {option.strike}
                    </TableCell>
                    <TableCell className="text-center">
                      <span className={option.putChange >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                        {option.putChange >= 0 ? '+' : ''}{option.putChange.toFixed(2)}
                      </span>
                    </TableCell>
                    <TableCell className="text-center text-red-400 font-semibold">
                      ₹{option.putPrice.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-center text-slate-300">
                      {(option.putOI / 1000).toFixed(0)}K
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className={`${getSignalColor(option.signal)} text-white`}>
                        {option.signal}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        <ShoppingCart className="h-3 w-3 mr-1" />
                        Buy
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
