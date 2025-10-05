import type { NextApiRequest, NextApiResponse } from 'next';
import { serialize } from 'cookie';
import { applyCorsHeaders } from '@/util/cors-helper';

export default function handler(req: NextApiRequest, res: NextApiResponse): void {
  // Handle preflight OPTIONS request and apply CORS headers
  if (req.method === 'OPTIONS') {
    applyCorsHeaders(req, res);
    res.status(200).end();
    return;
  }

  // Apply CORS headers for all other requests
  applyCorsHeaders(req, res);

  // Clear the httpOnly cookie by setting it to expire immediately
  res.setHeader(
    'Set-Cookie',
    serialize('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      expires: new Date(0),
      sameSite: process.env.NODE_ENV === 'development' ? 'lax' : 'strict',
      path: '/'
    })
  );

  res.send({ message: 'success' });
}
