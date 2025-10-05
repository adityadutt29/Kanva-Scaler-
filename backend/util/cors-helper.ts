import type { NextApiRequest, NextApiResponse } from 'next';

/**
 * Apply CORS headers to API responses to allow frontend (different port) to call backend APIs.
 * Uses ALLOWED_ORIGINS from backend/.env (comma-separated list) when available.
 */
export function applyCorsHeaders(req: NextApiRequest, res: NextApiResponse): void {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,PATCH,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
}

/**
 * Handle preflight OPTIONS requests
 */
export function handleOptionsRequest(req: NextApiRequest, res: NextApiResponse): boolean {
  if (req.method === 'OPTIONS') {
    applyCorsHeaders(req, res);
    res.status(200).end();
    return true;
  }
  return false;
}
