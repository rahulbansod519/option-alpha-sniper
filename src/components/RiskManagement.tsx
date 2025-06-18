
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertTriangle, Settings, Calculator } from 'lucide-react';

export const RiskManagement = () => {
  const [riskSettings, setRiskSettings] = useState({
    maxPositionSize: 50000,
    stopLossPercent: 20,
    maxDayLoss: 10000,
    maxOpenPositions: 5
  });

  const [currentMetrics, setCurrentMetrics] = useState({
    currentPositionSize: 35000,
    dayLoss: 2500,
    openPositions: 3,
    riskScore: 65
  });

  const calculatePositionSize = () => {
    const riskAmount = riskSettings.maxPositionSize * (riskSettings.stopLossPercent / 100);
    return riskAmount;
  };

  const getRiskLevel = (score: number) => {
    if (score < 30) return { level: 'Low', color: 'text-emerald-400' };
    if (score < 70) return { level: 'Medium', color: 'text-yellow-400' };
    return { level: 'High', color: 'text-red-400' };
  };

  const riskLevel = getRiskLevel(currentMetrics.riskScore);

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Risk Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Risk Score */}
          <div className="bg-slate-700/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-400">Risk Score</span>
              <span className={`text-lg font-bold ${riskLevel.color}`}>
                {currentMetrics.riskScore}/100
              </span>
            </div>
            <Progress 
              value={currentMetrics.riskScore} 
              className="h-2 mb-2" 
            />
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${riskLevel.color === 'text-emerald-400' ? 'bg-emerald-400' : riskLevel.color === 'text-yellow-400' ? 'bg-yellow-400' : 'bg-red-400'}`} />
              <span className={`text-sm ${riskLevel.color}`}>{riskLevel.level} Risk</span>
            </div>
          </div>

          {/* Current Metrics */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-700/30 rounded-lg p-3">
              <div className="text-xs text-slate-400">Position Size</div>
              <div className="text-sm text-white font-semibold">
                ₹{currentMetrics.currentPositionSize.toLocaleString()}
              </div>
              <div className="text-xs text-slate-400">
                of ₹{riskSettings.maxPositionSize.toLocaleString()} max
              </div>
            </div>
            
            <div className="bg-slate-700/30 rounded-lg p-3">
              <div className="text-xs text-slate-400">Day Loss</div>
              <div className="text-sm text-red-400 font-semibold">
                ₹{currentMetrics.dayLoss.toLocaleString()}
              </div>
              <div className="text-xs text-slate-400">
                of ₹{riskSettings.maxDayLoss.toLocaleString()} max
              </div>
            </div>
          </div>

          {/* Alerts */}
          {currentMetrics.dayLoss > riskSettings.maxDayLoss * 0.7 && (
            <Alert className="bg-yellow-900/20 border-yellow-600">
              <AlertTriangle className="h-4 w-4 text-yellow-400" />
              <AlertDescription className="text-yellow-400 text-sm">
                Approaching daily loss limit. Consider reducing position sizes.
              </AlertDescription>
            </Alert>
          )}

          {/* Risk Settings */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Settings className="h-4 w-4" />
              Risk Parameters
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-slate-400">Max Position Size</Label>
                <Input
                  type="number"
                  value={riskSettings.maxPositionSize}
                  onChange={(e) => setRiskSettings(prev => ({
                    ...prev,
                    maxPositionSize: Number(e.target.value)
                  }))}
                  className="bg-slate-700 border-slate-600 text-white text-sm"
                />
              </div>
              
              <div>
                <Label className="text-xs text-slate-400">Stop Loss %</Label>
                <Input
                  type="number"
                  value={riskSettings.stopLossPercent}
                  onChange={(e) => setRiskSettings(prev => ({
                    ...prev,
                    stopLossPercent: Number(e.target.value)
                  }))}
                  className="bg-slate-700 border-slate-600 text-white text-sm"
                />
              </div>
            </div>
          </div>

          {/* Position Size Calculator */}
          <div className="bg-slate-700/30 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <Calculator className="h-4 w-4 text-blue-400" />
              <span className="text-sm text-slate-400">Suggested Position Size</span>
            </div>
            <div className="text-lg font-bold text-blue-400">
              ₹{calculatePositionSize().toLocaleString()}
            </div>
            <div className="text-xs text-slate-400">
              Based on {riskSettings.stopLossPercent}% stop loss
            </div>
          </div>

          <Button className="w-full bg-blue-600 hover:bg-blue-700">
            Update Risk Settings
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
