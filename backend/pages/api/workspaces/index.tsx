import type { NextApiRequest, NextApiResponse } from 'next';

import { connectToDatabase } from '@/util/mongodb';
import { verifyTokenAndGetUserId } from '@/util/verify-jwt-token';

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  try {
    const { db } = await connectToDatabase();
    const token = req.cookies.token;
    
    // Verify user is authenticated
    const userId = await verifyTokenAndGetUserId(token);
    if (!userId) {
      res.status(401).send({ message: 'Unauthorized' });
      return;
    }

    const requestType = req.method;

    switch (requestType) {
      case 'POST': {
        const { name } = req.body;

        // Validate required fields
        if (!name) {
          res.status(400).send({ message: 'Name is required' });
          return;
        }

        const data = {
          name,
          ownerId: userId,
          members: [userId], // Owner is automatically a member
          dateCreated: new Date().toISOString(),
        };

        const workspace = await db.collection('workspaces').insertOne(data);
        res.status(201).send(workspace);
        return;
      }

      case 'GET': {
        // Find workspaces where user is either owner or member
        const workspaces = await db
          .collection('workspaces')
          .find({
            $or: [
              { ownerId: userId },
              { members: { $in: [userId] } }
            ]
          })
          .limit(30)
          .toArray();

        res.send(workspaces);
        return;
      }

      default:
        res.status(405).send({ message: 'Method not allowed' });
        break;
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Workspaces API error', err);
    res.status(500).send({ message: 'DB error', error: err?.message || err });
  }
}