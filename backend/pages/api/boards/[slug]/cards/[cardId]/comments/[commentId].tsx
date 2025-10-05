import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '@/util/mongodb';
import { verifyTokenAndGetUserId } from '@/util/verify-jwt-token';
import { logActivity } from '@/util/activity-logger';

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const { slug: boardId, cardId, commentId } = req.query;

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

    // Find the comment
    const comment = await db.collection('comments').findOne({ _id: commentId, cardId });
    if (!comment) {
      res.status(404).send({ message: 'Comment not found' });
      return;
    }

    // Check if the user is the author of the comment
    if (comment.authorId !== userId) {
      res.status(403).send({ message: 'Only the comment author can edit or delete this comment' });
      return;
    }

    const requestType = req.method;

    switch (requestType) {
      case 'PUT': {
        // Update the comment
        const { text } = req.body;

        if (!text || text.trim().length === 0) {
          res.status(400).send({ message: 'Comment text is required' });
          return;
        }

        const result = await db.collection('comments').updateOne(
          { _id: commentId },
          { $set: { text: text.trim(), updatedAt: new Date() } }
        );

        if (result.modifiedCount > 0) {
          const updatedComment = await db.collection('comments').findOne({ _id: commentId });
          
          // Log the comment update activity
          await logActivity({
            boardId: boardId as string,
            actorId: userId,
            action: 'comment_updated',
            targetId: commentId as string,
            targetType: 'comment',
            details: {
              cardTitle: card.title,
              commentText: text.trim()
            }
          });
          
          res.send(updatedComment);
        } else {
          res.status(500).send({ message: 'Failed to update comment' });
        }
        break;
      }

      case 'DELETE': {
        // Delete the comment
        const result = await db.collection('comments').deleteOne({ _id: commentId });

        if (result.deletedCount > 0) {
          // Log the comment deletion activity
          await logActivity({
            boardId: boardId as string,
            actorId: userId,
            action: 'comment_deleted',
            targetId: commentId as string,
            targetType: 'comment',
            details: {
              cardTitle: card.title,
              commentText: comment.text
            }
          });
          
          res.send({ message: 'Comment deleted successfully' });
        } else {
          res.status(500).send({ message: 'Failed to delete comment' });
        }
        break;
      }

      default:
        res.status(405).send({ message: 'Method not allowed' });
        break;
    }
 } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Comment API error', err);
    res.status(500).send({ msg: 'DB connection error', status: 500, error: err?.message || err });
  }
}