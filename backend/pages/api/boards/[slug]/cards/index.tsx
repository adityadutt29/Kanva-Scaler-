import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '@/util/mongodb';
import { verifyTokenAndGetUserId } from '@/util/verify-jwt-token';

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const { slug } = req.query;

  try {
    const { db } = await connectToDatabase();
    
    // Get token from cookie or Authorization header
    let token = req.cookies.token;
    if (!token && req.headers.authorization) {
      token = req.headers.authorization;
    }
    
    // Verify user is authenticated
    const userId = await verifyTokenAndGetUserId(token);
    if (!userId) {
      res.status(401).send({ message: 'Unauthorized' });
      return;
    }

    // Check if user has access to the board
    const board = await db.collection('boards').findOne({ _id: slug });
    if (!board) {
      res.status(404).send({ message: 'Board not found' });
      return;
    }

    // Check if user has access to the workspace this board belongs to
    if (board.workspaceId) {
      const workspace = await db.collection('workspaces').findOne({ _id: board.workspaceId });
      if (!workspace || (workspace.ownerId !== userId && !workspace.members.includes(userId))) {
        res.status(403).send({ message: 'Access denied to workspace' });
        return;
      }
    } else {
      // If no workspace, check if user created the board or is invited
      if (board.createdBy !== userId && !board.users.includes(userId)) {
        res.status(403).send({ message: 'Access denied to board' });
        return;
      }
    }

    const requestType = req.method;

    switch (requestType) {
      case 'GET': {
        const cards = await db.collection('cards').find({ boardId: slug }).toArray();
        res.send(cards);

        return;
      }

      case 'DELETE': {
        const { slug } = req.query;

        await db.collection('cards').deleteMany({ boardId: slug });
        res.send({ message: 'All cards deleted' });

        return;
      }

      default:
        res.status(405).send({ message: 'Method not allowed' });
        break;
    }
 } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Board cards API error', err);
    res.status(500).send({ msg: 'DB connection error', status: 500, error: err?.message || err });
  }
}
