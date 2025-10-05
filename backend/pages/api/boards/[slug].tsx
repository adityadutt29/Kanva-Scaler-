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

    const requestType = req.method;

    switch (requestType) {
      case 'GET': {
        const board = await db.collection('boards').findOne({ _id: slug });
        
        // Check if user has access to this board
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
        
        res.send(board);
        break;
      }

      case 'PATCH': {
        const board = await db.collection('boards').findOne({ _id: slug });
        
        // Check if user has permission to update the board
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
          // If no workspace, check if user created the board
          if (board.createdBy !== userId) {
            res.status(403).send({ message: 'Only board creator can update board' });
            return;
          }
        }

        const { _id, name, dateCreated, createdBy, backgroundImage, workspaceId } = req.body;

        const data = {
          _id,
          name,
          dateCreated,
          createdBy,
          backgroundImage,
          workspaceId: workspaceId || board.workspaceId // Maintain existing workspaceId if not provided
        };

        const updatedBoard = await db.collection('boards').updateOne({ _id: slug }, { $set: data });
        res.send(updatedBoard);

        break;
      }

      case 'DELETE': {
        const board = await db.collection('boards').findOne({ _id: slug });
        
        // Check if user has permission to delete the board
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
          // If no workspace, check if user created the board
          if (board.createdBy !== userId) {
            res.status(403).send({ message: 'Only board creator can delete board' });
            return;
          }
        }

        await db.collection('cards').deleteMany({ boardId: slug });
        await db.collection('columns').deleteMany({ boardId: slug });
        await db.collection('boards').deleteOne({ _id: slug });

        res.send({ message: 'Delete boards with columns and cards' });

        break;
      }

      default:
        res.status(405).send({ message: 'Method not allowed' });
        break;
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Board slug API error', err);
    res.status(500).send({ msg: 'DB connection error', status: 500, error: err?.message || err });
  }
}
