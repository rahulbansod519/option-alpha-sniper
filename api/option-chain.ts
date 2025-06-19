
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { jwtToken } = req.headers;
  const { name, expiry } = req.query;

  if (!jwtToken) {
    return res.status(401).json({ error: 'JWT token required' });
  }

  if (!name || !expiry) {
    return res.status(400).json({ error: 'Name and expiry are required' });
  }

  try {
    const response = await fetch(`https://apiconnect.angelbroking.com/rest/secure/angelbroking/market/v1/optionChain?name=${name}&expiry=${expiry}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${jwtToken}`,
        'X-PrivateKey': process.env.ANGEL_API_KEY || '',
        'X-SourceID': 'WEB',
        'X-UserType': 'USER'
      }
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Option chain error:', error);
    res.status(500).json({ error: 'Failed to fetch option chain' });
  }
}
