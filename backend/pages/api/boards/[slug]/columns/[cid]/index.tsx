import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '@/util/mongodb';
import { verifyTokenAndGetUserId } from '@/util/verify-jwt-token';
import { logActivity } from '@/util/activity-logger';

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const { cid, slug: boardId } = req.query;

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
    const board = await db.collection('boards').findOne({ _id: boardId });
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
      case 'PATCH': {
        // Get column details before update for logging
        const column = await db.collection('columns').findOne({ _id: cid });
        
        const result = await db
          .collection('columns')
          .updateOne({ _id: cid }, { $set: { ...req.body } });

        // Log the column update activity
        if (column) {
          await logActivity({
            boardId: boardId as string,
            actorId: userId,
            action: 'column_updated',
            targetId: cid as string,
            targetType: 'column',
            details: {
              columnName: column.columnName,
              updatedFields: Object.keys(req.body)
            }
          });
        }

        res.send(result);

        break;
      }

      case 'DELETE': {
        // Get column details before deletion for logging
        const column = await db.collection('columns').findOne({ _id: cid });
        
        await db.collection('cards').deleteMany({ columnId: cid });
        await db.collection('columns').deleteOne({ _id: cid });

        // Log the column deletion activity
        if (column) {
          await logActivity({
            boardId: boardId as string,
            actorId: userId,
            action: 'column_deleted',
            targetId: cid as string,
            targetType: 'column',
            details: {
              columnName: column.columnName
            }
          });
        }

        res.send({ messsage: 'Deleted' });

        break;
      }

      default:
        res.status(400).send({ message: 'Invalid request type' });
        break;
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Column endpoint error', err);
    res.status(500).send({ msg: 'DB connection error', status: 500, error: err?.message || err });
  }
}
