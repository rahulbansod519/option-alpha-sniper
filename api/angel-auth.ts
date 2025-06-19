
import type { VercelRequest, VercelResponse } from '@vercel/node';

interface AuthResponse {
  status: boolean;
  message: string;
  data?: {
    jwtToken: string;
    refreshToken: string;
    feedToken: string;
  };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { clientcode, password, totp } = req.body;

  if (!clientcode || !password || !totp) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const response = await fetch('https://apiconnect.angelbroking.com/rest/auth/angelbroking/user/v1/loginByPassword', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-UserType': 'USER',
        'X-SourceID': 'WEB',
        'X-ClientLocalIP': '192.168.1.1',
        'X-ClientPublicIP': '106.193.147.98',
        'X-MACAddress': '11:11:11:11:11:11',
        'X-PrivateKey': process.env.ANGEL_API_KEY || ''
      },
      body: JSON.stringify({
        clientcode,
        password,
        totp
      })
    });

    const data: AuthResponse = await response.json();
    
    if (data.status) {
      res.status(200).json(data);
    } else {
      res.status(401).json({ error: data.message });
    }
  } catch (error) {
    console.error('Angel One auth error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
}
