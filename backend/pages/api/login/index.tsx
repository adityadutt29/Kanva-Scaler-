import type { NextApiRequest, NextApiResponse } from 'next';

import { connectToDatabase } from '@/util/mongodb';
import { compare } from 'bcrypt';
import { serialize } from 'cookie';
import { sign } from 'jsonwebtoken';
import { applyCorsHeaders, handleOptionsRequest } from '@/util/cors-helper';

const KEY = process.env.JWT_SECRET_KEY;

const isUserExists = async (db, email) => {
  const user = await db.collection('users').findOne({ email: email });

  if (user) {
    return user;
  }

  return null;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  // Handle preflight OPTIONS request and apply CORS headers
  if (req.method === 'OPTIONS') {
    applyCorsHeaders(req, res);
    res.status(200).end();
    return;
  }

  // Apply CORS headers for all other requests
  applyCorsHeaders(req, res);

  if (req.method === 'POST') {
    const { email, password } = req.body;

    // Check any field is empty
    if (!email || !password) {
      res.status(400).json({ error: 'email or password is missing' });
      return;
    }

    try {
      const { db } = await connectToDatabase();
      const userDetail = await isUserExists(db, email);

      if (userDetail) {
        // Use compare as a promise instead of callback
        const isMatched = await new Promise<boolean>((resolve, reject) => {
          compare(password, userDetail.password, function (err, result) {
            if (err) {
              reject(err);
            } else {
              resolve(result);
            }
          });
        });

        if (isMatched === true) {
          const claim = { id: userDetail._id, email: userDetail.email };
          const token = sign({ user: claim }, KEY, { expiresIn: '4h' });

          res.setHeader(
            'Set-Cookie',
            serialize('token', token, {
              httpOnly: true,
              secure: process.env.NODE_ENV !== 'development',
              maxAge: 4 * 60 * 60 * 1000,
              sameSite: process.env.NODE_ENV === 'development' ? 'lax' : 'strict',
              path: '/'
            })
          );

          res.json({ message: 'success', token, id: userDetail._id, status: 200 });
        } else {
          res.status(404).json({ error: 'Invalid username or password' });
        }
      } else {
        // User does not exist
        res.status(404).json({ error: 'Invalid username or password' });
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Login API error', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
