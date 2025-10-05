import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '@/util/mongodb';
import { verifyTokenAndGetUserId } from '@/util/verify-jwt-token';
import { logActivity } from '@/util/activity-logger';
import { broadcastCommentAdded } from '@/util/websocket-broadcaster';

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const { slug: boardId, cardId } = req.query;

 try {
    const { db } = await connectToDatabase();
    const token = req.cookies.token;
    
    // Verify user is authenticated
    const userId = await verifyTokenAndGetUserId(token);
    if (!userId) {
      res.status(401).send({ message: 'Unauthorized' });
      return;
    }

    // Check if user has access to the board's workspace
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

    // Check if the card exists
    const card = await db.collection('cards').findOne({ _id: cardId, boardId: boardId });
    if (!card) {
      res.status(404).send({ message: 'Card not found' });
      return;
    }

    const requestType = req.method;

    switch (requestType) {
      case 'GET': {
        // Get all comments for the card
        const comments = await db.collection('comments').find({ cardId }).sort({ timestamp: -1 }).toArray();
        res.send(comments);
        break;
      }

      case 'POST': {
        // Create a new comment
        const { text } = req.body;

        if (!text || text.trim().length === 0) {
          res.status(400).send({ message: 'Comment text is required' });
          return;
        }

        const commentData = {
          _id: `${Date.now()}`, // Generate a unique ID
          cardId,
          authorId: userId,
          text: text.trim(),
          timestamp: new Date()
        };

        const result = await db.collection('comments').insertOne(commentData);
        
        // Log the comment creation activity
        await logActivity({
          boardId: boardId as string,
          actorId: userId,
          action: 'comment_added',
          targetId: commentData._id,
          targetType: 'comment',
          details: {
            cardTitle: card.title,
            commentText: text.trim()
          }
        });
        
        // Broadcast the comment addition to all connected clients
        await broadcastCommentAdded(
          boardId as string,
          result.ops[0],
          cardId as string,
          userId
        );
        
        res.status(201).send(result.ops[0]);
        break;
      }

      default:
        res.status(405).send({ message: 'Method not allowed' });
        break;
    }
 } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Comments API error', err);
    res.status(500).send({ msg: 'DB connection error', status: 500, error: err?.message || err });
  }
}