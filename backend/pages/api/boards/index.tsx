import type { NextApiRequest, NextApiResponse } from 'next';

import { connectToDatabase } from '@/util/mongodb';
import { verifyTokenAndGetUserId } from '@/util/verify-jwt-token';

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  try {
    const { db } = await connectToDatabase();
    
    // Try to get token from cookie or Authorization header
    const token = req.cookies.token || req.headers.authorization?.replace('Bearer ', '');
    
    // Verify user is authenticated
    const userId = await verifyTokenAndGetUserId(token);
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const requestType = req.method;

    switch (requestType) {
      case 'POST': {
        const { _id, name, dateCreated, createdBy, backgroundImage, workspaceId } = req.body;

        // Validate required fields
        if (!name) {
          res.status(400).json({ message: 'Name is required' });
          return;
        }

        let finalWorkspaceId = workspaceId;

        // If no workspaceId provided, create or get default workspace for user
        if (!finalWorkspaceId) {
          // Check if user has a default workspace
          let defaultWorkspace = await db.collection('workspaces').findOne({ 
            ownerId: userId, 
            name: 'My Workspace' 
          });

          if (!defaultWorkspace) {
            // Create default workspace
            const newWorkspace = {
              _id: `ws-${Date.now()}`,
              name: 'My Workspace',
              ownerId: userId,
              members: [],
              dateCreated: new Date().toISOString()
            };
            await db.collection('workspaces').insertOne(newWorkspace);
            finalWorkspaceId = newWorkspace._id;
          } else {
            finalWorkspaceId = defaultWorkspace._id;
          }
        } else {
          // Check if user has access to the workspace (owner or member)
          const workspace = await db.collection('workspaces').findOne({ _id: finalWorkspaceId });
          if (!workspace || (workspace.ownerId !== userId && !workspace.members.includes(userId))) {
            res.status(403).json({ message: 'Access denied to workspace' });
            return;
          }
        }

        const data = {
          _id,
          name,
          dateCreated,
          createdBy,
          backgroundImage,
          workspaceId: finalWorkspaceId, // Add workspaceId to the board
          users: []
        };

        const board = await db.collection('boards').insertOne(data);
        res.status(201).json(board);

        return;
      }

      case 'GET': {
        const { userid } = req.query;

        // Get workspaces user belongs to
        const workspaces = await db.collection('workspaces').find({
          $or: [
            { ownerId: userId },
            { members: { $in: [userId] } }
          ]
        }).toArray();
        
        const workspaceIds = workspaces.map(ws => ws._id);

        // Find boards in these workspaces
        const boards = await db
          .collection('boards')
          .find({
            $or: [
              { createdBy: userId },
              { workspaceId: { $in: workspaceIds } }
            ]
          })
          .limit(30)
          .toArray();

        const invitedBoards = await db.collection('boards').find({ users: userId }).toArray();
        const updatedBoards = boards.concat(invitedBoards);

        res.json(updatedBoards);

        return;
      }

      default:
        res.status(405).json({ message: 'Method not allowed' });
        break;
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Boards API error', err);
    res.status(500).json({ message: 'DB error', error: err?.message || err });
  }
}
