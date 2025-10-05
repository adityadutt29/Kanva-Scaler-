import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '@/util/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const { token } = req.query;

  try {
    const { db } = await connectToDatabase();

    const requestType = req.method;

    switch (requestType) {
      case 'GET': {
        const tokenValue = await db.collection('token').findOne({ token });

        if (tokenValue) {
          res.status(200).send({ message: 'valid' });
        } else {
          res.status(404).send({ message: 'Not valid' });
        }

        break;
      }

      default:
        res.status(400).send({ message: 'Invalid request' });
        break;
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Verify token API error', err);
    res.status(500).send({ msg: 'DB connection error', status: 500, error: err?.message || err });
  }
}
