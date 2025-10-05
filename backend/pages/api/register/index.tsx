import type { NextApiRequest, NextApiResponse } from 'next';

import { connectToDatabase } from '@/util/mongodb';
import { hash } from 'bcrypt';
import { applyCorsHeaders, handleOptionsRequest } from '@/util/cors-helper';

const SALTROUNDS = 10;

const isUserExists = async (db, email) => {
  const user = await db.collection('users').find({ email: email }).toArray();

  if (user.length > 0) {
    return true;
  }

  return false;
};

const createUser = async (body, res) => {
  const { email, password, id, fullName } = body;

  try {
    const { db, client } = await connectToDatabase();

    const isExistingUser = await isUserExists(db, email);

    if (isExistingUser) {
      res.status(409).json({ message: 'Email is already registered' });
      return;
    }

    // Create User
    const hashed = await hash(password, SALTROUNDS);

    const insertResult = await db.collection('users').insertOne({ _id: id, email, password: hashed, fullName });

    if (insertResult.acknowledged) {
      res.status(200).json({ message: 'success' });
      return;
    }

    res.status(500).json({ message: 'failed' });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Registration error', err);
    res.status(500).json({ message: 'DB error', error: err?.message || err });
  }
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
    await createUser(req.body, res);
    return;
  }

  // If we get here, method not allowed
  res.status(405).json({ message: 'Method Not Allowed' });
}
