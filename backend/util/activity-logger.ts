import { ObjectId } from 'mongodb';
import { connectToDatabase } from './mongodb';

export interface ActivityLogEntry {
  _id?: ObjectId;
  boardId: string;
  actorId: string;
  action: string;
  targetId?: string;
  targetType?: string;
  timestamp: Date;
  details?: any;
}

/**
 * Logs an activity to the database
 */
export async function logActivity(activity: Omit<ActivityLogEntry, '_id' | 'timestamp'>): Promise<void> {
  try {
    const { db } = await connectToDatabase();
    
    const activityLogEntry: ActivityLogEntry = {
      ...activity,
      timestamp: new Date()
    };
    
    await db.collection('activityLog').insertOne(activityLogEntry);
 } catch (error) {
    console.error('Error logging activity:', error);
    // Don't throw error as logging shouldn't break the main functionality
  }
}

/**
 * Fetches activity logs for a specific board
 */
export async function getActivityLog(boardId: string, limit: number = 20): Promise<any[]> {
  try {
    const { db } = await connectToDatabase();
    
    const activities = await db.collection('activityLog')
      .find({ boardId })
      .sort({ timestamp: -1 }) // Sort by newest first
      .limit(limit)
      .toArray();
    
    // Enrich activities with user names
    const enrichedActivities = await Promise.all(
      activities.map(async (activity) => {
        let actorName = 'Unknown User';
        
        // Fetch the user details to get the name
        if (activity.actorId) {
          const user = await db.collection('users').findOne({ _id: activity.actorId });
          if (user) {
            actorName = user.fullName || user.email || user.username || 'Unknown User';
          }
        }
        
        // Enrich target name from details
        let targetName = activity.targetId;
        if (activity.details?.columnName) {
          targetName = activity.details.columnName;
        } else if (activity.details?.cardTitle || activity.details?.title) {
          targetName = activity.details.cardTitle || activity.details.title;
        }
        
        return {
          _id: activity._id.toString(),
          boardId: activity.boardId,
          actorId: activity.actorId,
          actorName, // Add actor name
          action: activity.action,
          targetId: activity.targetId,
          targetType: activity.targetType,
          timestamp: activity.timestamp,
          details: {
            ...activity.details,
            targetName // Add enriched target name to details
          }
        };
      })
    );
    
    return enrichedActivities;
  } catch (error) {
    console.error('Error fetching activity log:', error);
    throw error;
  }
}