
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { jwtToken } = req.headers;
  const { exchange, symboltoken, interval, fromdate, todate } = req.body;

  if (!jwtToken) {
    return res.status(401).json({ error: 'JWT token required' });
  }

  try {
    const response = await fetch('https://apiconnect.angelbroking.com/rest/secure/angelbroking/historical/v1/getCandleData', {
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
        symboltoken,
        interval,
        fromdate,
        todate
      })
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Historical data error:', error);
    res.status(500).json({ error: 'Failed to fetch historical data' });
  }
}
