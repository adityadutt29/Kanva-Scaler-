import type { NextApiRequest, NextApiResponse } from 'next';

import { connectToDatabase } from '@/util/mongodb';
import { verifyTokenAndGetUserId } from '@/util/verify-jwt-token';

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const { id } = req.query;

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
      case 'GET': {
        // Find workspace by ID
        const workspace = await db.collection('workspaces').findOne({ _id: id });
        
        // Check if user has access to this workspace (owner or member)
        if (!workspace || (workspace.ownerId !== userId && !workspace.members.includes(userId))) {
          res.status(403).send({ message: 'Access denied' });
          return;
        }

        res.send(workspace);
        return;
      }

      case 'PUT': {
        const { name, members } = req.body;

        // Find workspace by ID
        const workspace = await db.collection('workspaces').findOne({ _id: id });
        
        // Only owner can update workspace
        if (!workspace || workspace.ownerId !== userId) {
          res.status(403).send({ message: 'Only workspace owner can update workspace' });
          return;
        }

        // Prepare update data
        const updateData: any = {};
        if (name) updateData.name = name;
        if (members !== undefined) updateData.members = members; // Allow empty array to be passed
        
        // Update workspace
        const result = await db.collection('workspaces').updateOne(
          { _id: id },
          { $set: updateData }
        );

        res.send(result);
        return;
      }

      case 'DELETE': {
        // Find workspace by ID
        const workspace = await db.collection('workspaces').findOne({ _id: id });
        
        // Only owner can delete workspace
        if (!workspace || workspace.ownerId !== userId) {
          res.status(403).send({ message: 'Only workspace owner can delete workspace' });
          return;
        }

        // Delete workspace
        await db.collection('workspaces').deleteOne({ _id: id });

        // Also delete all boards in this workspace
        await db.collection('boards').deleteMany({ workspaceId: id });

        res.send({ message: 'Workspace deleted successfully' });
        return;
      }

      default:
        res.status(405).send({ message: 'Method not allowed' });
        break;
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Workspace API error', err);
    res.status(500).send({ message: 'DB error', error: err?.message || err });
  }
}