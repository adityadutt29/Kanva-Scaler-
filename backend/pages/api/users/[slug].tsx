import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '@/util/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const { slug } = req.query;

  try {
    const { db } = await connectToDatabase();

    const requestType = req.method;

    switch (requestType) {
      case 'GET': {
        const user = await db.collection('users').findOne({ _id: slug });

        res.send(user);

        break;
      }

      case 'PATCH': {
        res.status(400).send({ message: 'Not implemented' });
        break;
      }

      case 'DELETE': {
        res.status(400).send({ message: 'Not implemented' });
        break;
      }

      default:
        res.status(400).send({ message: 'Invalid request' });
        break;
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Users API error', err);
    res.status(500).send({ msg: 'DB connection error', status: 500, error: err?.message || err });
  }
}
