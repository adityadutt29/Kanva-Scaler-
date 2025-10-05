import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '@/util/mongodb';
import { verifyTokenAndGetUserId } from '@/util/verify-jwt-token';
import { logActivity } from '@/util/activity-logger';
import { broadcastCardUpdate } from '@/util/websocket-broadcaster';

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const { cardId, slug: boardId } = req.query;

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
      case 'GET': {
        res.send({ message: 'Get more details of the card' });
        return;
      }

      case 'DELETE': {
        // Get card details before deletion for logging
        const card = await db.collection('cards').findOne({ _id: cardId });
        
        await db.collection('cards').deleteOne({ _id: cardId });

        // Log the card deletion activity
        if (card) {
          await logActivity({
            boardId: boardId as string,
            actorId: userId,
            action: 'card_deleted',
            targetId: cardId as string,
            targetType: 'card',
            details: {
              title: card.title
            }
          });
        }

        res.send({ message: 'A card has been deleted' });

        return;
      }

      case 'PATCH': {
        // Get card details before update for logging
        const card = await db.collection('cards').findOne({ _id: cardId });
        
        await db
          .collection('cards')
          .updateOne({ _id: cardId, boardId: boardId }, { $set: { ...req.body } });

        // Get updated card data
        const updatedCard = await db.collection('cards').findOne({ _id: cardId });
        
        // Log the card update activity
        if (card) {
          await logActivity({
            boardId: boardId as string,
            actorId: userId,
            action: 'card_updated',
            targetId: cardId as string,
            targetType: 'card',
            details: {
              title: card.title,
              updatedFields: Object.keys(req.body)
            }
          });
          
          // Broadcast the card update to all connected clients
          await broadcastCardUpdate(
            boardId as string,
            updatedCard,
            userId
          );
        }

        res.send({ message: 'Card updated' });
        return;
      }

      default:
        res.status(400).send({ message: 'Invalid request' });
        break;
    }
 } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Board card API error', err);
    res.status(500).send({ msg: 'DB connection error', status: 500, error: err?.message || err });
  }
}
