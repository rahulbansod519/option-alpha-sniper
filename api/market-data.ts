
import type { VercelRequest, VercelResponse } from '@vercel/node';

interface MarketDataRequest {
  exchange: string;
  tradingsymbol: string;
  symboltoken: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { jwtToken } = req.headers;
  const { exchange, tradingsymbol, symboltoken }: MarketDataRequest = req.body;

  if (!jwtToken) {
    return res.status(401).json({ error: 'JWT token required' });
  }

  try {
    const response = await fetch('https://apiconnect.angelbroking.com/rest/secure/angelbroking/order/v1/getLTP', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${jwtToken}`,
        'X-PrivateKey': process.env.ANGEL_API_KEY || '',
        'X-SourceID': 'WEB',
        'X-UserType': 'USER'
      },
      body: JSON.stringify({
        exchange,
        tradingsymbol,
        symboltoken
      })
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Market data error:', error);
    res.status(500).json({ error: 'Failed to fetch market data' });
  }
}
