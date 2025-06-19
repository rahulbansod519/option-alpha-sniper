
import { useState, useCallback } from 'react';

interface AuthTokens {
  jwtToken: string;
  refreshToken: string;
  feedToken: string;
}

interface MarketData {
  exchange: string;
  tradingsymbol: string;
  ltp: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

export const useAngelOne = () => {
  const [tokens, setTokens] = useState<AuthTokens | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const authenticate = useCallback(async (clientcode: string, password: string, totp: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/angel-auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ clientcode, password, totp }),
      });

      const data = await response.json();
      
      if (data.status && data.data) {
        setTokens(data.data);
        setIsAuthenticated(true);
        localStorage.setItem('angelTokens', JSON.stringify(data.data));
      } else {
        throw new Error(data.message || 'Authentication failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);

  const getMarketData = useCallback(async (exchange: string, tradingsymbol: string, symboltoken: string) => {
    if (!tokens?.jwtToken) {
      throw new Error('Not authenticated');
    }

    const response = await fetch('/api/market-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'jwtToken': tokens.jwtToken,
      },
      body: JSON.stringify({ exchange, tradingsymbol, symboltoken }),
    });

    const data = await response.json();
    return data;
  }, [tokens]);

  const getOptionChain = useCallback(async (name: string, expiry: string) => {
    if (!tokens?.jwtToken) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`/api/option-chain?name=${name}&expiry=${expiry}`, {
      headers: {
        'jwtToken': tokens.jwtToken,
      },
    });

    const data = await response.json();
    return data;
  }, [tokens]);

  const getHistoricalData = useCallback(async (
    exchange: string,
    symboltoken: string,
    interval: string,
    fromdate: string,
    todate: string
  ) => {
    if (!tokens?.jwtToken) {
      throw new Error('Not authenticated');
    }

    const response = await fetch('/api/historical-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'jwtToken': tokens.jwtToken,
      },
      body: JSON.stringify({ exchange, symboltoken, interval, fromdate, todate }),
    });

    const data = await response.json();
    return data;
  }, [tokens]);

  // Load tokens from localStorage on mount
  useState(() => {
    const storedTokens = localStorage.getItem('angelTokens');
    if (storedTokens) {
      try {
        const parsedTokens = JSON.parse(storedTokens);
        setTokens(parsedTokens);
        setIsAuthenticated(true);
      } catch (err) {
        localStorage.removeItem('angelTokens');
      }
    }
  });

  return {
    isAuthenticated,
    loading,
    error,
    authenticate,
    getMarketData,
    getOptionChain,
    getHistoricalData,
    tokens
  };
};
