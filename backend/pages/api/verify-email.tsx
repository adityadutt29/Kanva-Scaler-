import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '@/util/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const { email } = req.query;

  try {
    const { db } = await connectToDatabase();

    const requestType = req.method;

    switch (requestType) {
      case 'GET': {
        const user = await db.collection('users').findOne({ email });
        if (user) {
          res.send({ status: 200, message: 'Found' });
        } else {
          res.send({ status: 404, message: 'Not found' });
        }

        break;
      }

      default:
        res.status(400).send({ message: 'Invalid request' });
        break;
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Verify email API error', err);
    res.status(500).send({ msg: 'DB connection error', status: 500, error: err?.message || err });
  }
}
