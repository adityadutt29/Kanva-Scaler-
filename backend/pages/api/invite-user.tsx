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
      case 'PATCH': {
        const { email, boardId } = req.body;
        const user = await db.collection('users').findOne({ email });
        const boardData = await db.collection('boards').findOne({ _id: boardId });

        if (!boardData) {
          res.status(404).send({ message: 'Board not found' });
          return;
        }

        // Check if the user has access to this board (either through workspace membership or board access)
        if (boardData.workspaceId) {
          const workspace = await db.collection('workspaces').findOne({ _id: boardData.workspaceId });
          if (!workspace || (workspace.ownerId !== userId && !workspace.members.includes(userId))) {
            res.status(403).send({ message: 'Access denied to workspace' });
            return;
          }
        } else {
          // If no workspace, user must be the board creator
          if (boardData.createdBy !== userId) {
            res.status(403).send({ message: 'Access denied to board' });
            return;
          }
        }

        const isExistingUser = boardData.users.indexOf(user._id);

        if (isExistingUser > -1) {
          res.status(400).send({ message: 'User is already added to the board' });
        } else {
          const board = await db
            .collection('boards')
            .updateOne({ _id: boardId }, { $push: { users: user?._id } });

          if (board) {
            res.send({ status: 200, message: 'Invited' });
          } else {
            res.send({ status: 404, message: 'Some issues' });
          }
        }

        break;
      }

      default:
        res.status(405).send({ message: 'Method not allowed' });
        break;
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Invite API error', err);
    res.status(500).send({ msg: 'DB connection error', status: 500, error: err?.message || err });
  }
}
