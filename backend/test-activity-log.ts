/**
 * Test file to demonstrate Activity Log functionality
 * This is not a formal test suite but shows how the activity logging works
 */

import { logActivity, ActivityLogEntry } from './util/activity-logger';

// Example of how to manually log an activity (this would normally be done automatically by the API routes)
async function testActivityLogging() {
  console.log('Testing Activity Log functionality...');
  
  // Example of logging a card creation activity
  try {
    await logActivity({
      boardId: 'board123',
      actorId: 'user456',
      action: 'card_created',
      targetId: 'card789',
      targetType: 'card',
      details: {
        title: 'Sample Card',
        columnId: 'column101'
      }
    });
    
    console.log('✓ Successfully logged card creation activity');
  } catch (error) {
    console.error('✗ Error logging activity:', error);
  }
  
  // Example of logging a column update activity
  try {
    await logActivity({
      boardId: 'board123',
      actorId: 'user456',
      action: 'column_renamed',
      targetId: 'column101',
      targetType: 'column',
      details: {
        oldName: 'To Do',
        newName: 'Backlog'
      }
    });
    
    console.log('✓ Successfully logged column rename activity');
  } catch (error) {
    console.error('✗ Error logging activity:', error);
  }
  
  // Example of logging a comment addition activity
  try {
    await logActivity({
      boardId: 'board123',
      actorId: 'user456',
      action: 'comment_added',
      targetId: 'comment112',
      targetType: 'comment',
      details: {
        cardTitle: 'Sample Card',
        commentText: 'This is a sample comment'
      }
    });
    
    console.log('✓ Successfully logged comment addition activity');
  } catch (error) {
    console.error('✗ Error logging activity:', error);
  }
  
  console.log('\nActivity logging test completed. The actual API routes will automatically log activities when users perform actions.');
}

// Run the test
testActivityLogging().catch(console.error);