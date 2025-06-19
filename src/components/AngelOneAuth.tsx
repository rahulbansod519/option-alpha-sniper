
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAngelOne } from '@/hooks/useAngelOne';
import { Key, User, Smartphone } from 'lucide-react';

export const AngelOneAuth = () => {
  const [credentials, setCredentials] = useState({
    clientcode: '',
    password: '',
    totp: ''
  });

  const { authenticate, loading, error, isAuthenticated } = useAngelOne();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await authenticate(credentials.clientcode, credentials.password, credentials.totp);
  };

  if (isAuthenticated) {
    return (
      <Alert className="bg-emerald-900/20 border-emerald-600">
        <Key className="h-4 w-4 text-emerald-400" />
        <AlertDescription className="text-emerald-400">
          Successfully connected to Angel One SmartAPI
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Key className="h-5 w-5" />
          Connect Angel One SmartAPI
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="text-slate-300 flex items-center gap-2">
              <User className="h-4 w-4" />
              Client Code
            </Label>
            <Input
              type="text"
              value={credentials.clientcode}
              onChange={(e) => setCredentials(prev => ({ ...prev, clientcode: e.target.value }))}
              className="bg-slate-700 border-slate-600 text-white"
              placeholder="Enter your client code"
              required
            />
          </div>

          <div>
            <Label className="text-slate-300 flex items-center gap-2">
              <Key className="h-4 w-4" />
              Password
            </Label>
            <Input
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
              className="bg-slate-700 border-slate-600 text-white"
              placeholder="Enter your password"
              required
            />
          </div>

          <div>
            <Label className="text-slate-300 flex items-center gap-2">
              <Smartphone className="h-4 w-4" />
              TOTP (6-digit code)
            </Label>
            <Input
              type="text"
              value={credentials.totp}
              onChange={(e) => setCredentials(prev => ({ ...prev, totp: e.target.value }))}
              className="bg-slate-700 border-slate-600 text-white"
              placeholder="Enter TOTP from app"
              maxLength={6}
              required
            />
          </div>

          {error && (
            <Alert className="bg-red-900/20 border-red-600">
              <AlertDescription className="text-red-400">
                {error}
              </AlertDescription>
            </Alert>
          )}

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {loading ? 'Connecting...' : 'Connect to Angel One'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
