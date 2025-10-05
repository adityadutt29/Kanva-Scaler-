import { ObjectId } from 'mongodb';
import bcrypt from 'bcrypt';
import { connectToDatabase } from '../util/mongodb';

async function seedDatabase() {
  try {
    console.log('Connecting to database...');
    const { db } = await connectToDatabase();

    // Clear existing data
    console.log('Clearing existing data...');
    await db.collection('users').deleteMany({});
    await db.collection('boards').deleteMany({});
    await db.collection('columns').deleteMany({});
    await db.collection('cards').deleteMany({});
    await db.collection('comments').deleteMany({});
    await db.collection('activityLog').deleteMany({});

    // Create sample user
    console.log('Creating sample user...');
    const hashedPassword = await bcrypt.hash('password123', 10);
    const sampleUser = {
      _id: new ObjectId(),
      email: 'demo@example.com',
      password: hashedPassword,
      fullName: 'Demo User',
      dateCreated: new Date(),
      isActive: true
    };

    const userResult = await db.collection('users').insertOne(sampleUser);
    console.log(`Created user with ID: ${userResult.insertedId}`);

    // Create sample board
    console.log('Creating sample board...');
    const sampleBoard = {
      _id: new ObjectId(),
      name: 'Project Roadmap',
      createdBy: userResult.insertedId.toString(),
      dateCreated: new Date(),
      backgroundImage: 'https://images.unsplash.com/photo-1551342678-a3a9547d8c52?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80',
      users: [userResult.insertedId.toString()],
      settings: {
        cardSorting: 'manual',
        permissions: {
          canEdit: 'all',
          canComment: 'all'
        }
      }
    };

    const boardResult = await db.collection('boards').insertOne(sampleBoard);
    console.log(`Created board with ID: ${boardResult.insertedId}`);

    // Create sample lists (columns)
    console.log('Creating sample columns...');
    const sampleColumns = [
      {
        _id: new ObjectId(),
        boardId: boardResult.insertedId.toString(),
        name: 'Backlog',
        sequence: 1,
        createdBy: userResult.insertedId.toString(),
        date: new Date(),
        archived: false
      },
      {
        _id: new ObjectId(),
        boardId: boardResult.insertedId.toString(),
        name: 'To Do',
        sequence: 2,
        createdBy: userResult.insertedId.toString(),
        date: new Date(),
        archived: false
      },
      {
        _id: new ObjectId(),
        boardId: boardResult.insertedId.toString(),
        name: 'In Progress',
        sequence: 3,
        createdBy: userResult.insertedId.toString(),
        date: new Date(),
        archived: false
      },
      {
        _id: new ObjectId(),
        boardId: boardResult.insertedId.toString(),
        name: 'Review',
        sequence: 4,
        createdBy: userResult.insertedId.toString(),
        date: new Date(),
        archived: false
      },
      {
        _id: new ObjectId(),
        boardId: boardResult.insertedId.toString(),
        name: 'Done',
        sequence: 5,
        createdBy: userResult.insertedId.toString(),
        date: new Date(),
        archived: false
      }
    ];

    const columnsResult = await db.collection('columns').insertMany(sampleColumns);
    console.log(`Created ${columnsResult.insertedCount} columns`);

    // Create sample cards
    console.log('Creating sample cards...');
    const sampleCards = [
      {
        _id: new ObjectId(),
        title: 'Design homepage layout',
        description: 'Create wireframes and mockups for the new homepage design',
        boardId: boardResult.insertedId.toString(),
        columnId: columnsResult.insertedIds[0], // Backlog
        sequence: 1,
        userId: userResult.insertedId.toString(),
        dateCreated: new Date(),
        dateUpdated: new Date(),
        assignedTo: [userResult.insertedId.toString()],
        labels: [
          {
            bg: '#FF6B6B',
            type: 'bug'
          }
        ],
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 1000), // 7 days from now
        archived: false
      },
      {
        _id: new ObjectId(),
        title: 'Implement user authentication',
        description: 'Set up login and registration functionality with JWT tokens',
        boardId: boardResult.insertedId.toString(),
        columnId: columnsResult.insertedIds[1], // To Do
        sequence: 1,
        userId: userResult.insertedId.toString(),
        dateCreated: new Date(),
        dateUpdated: new Date(),
        assignedTo: [userResult.insertedId.toString()],
        labels: [
          {
            bg: '#4ECDC4',
            type: 'feature'
          }
        ],
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
        archived: false
      },
      {
        _id: new ObjectId(),
        title: 'Setup database schema',
        description: 'Define and implement the MongoDB collections and relationships',
        boardId: boardResult.insertedId.toString(),
        columnId: columnsResult.insertedIds[2], // In Progress
        sequence: 1,
        userId: userResult.insertedId.toString(),
        dateCreated: new Date(),
        dateUpdated: new Date(),
        assignedTo: [userResult.insertedId.toString()],
        labels: [
          {
            bg: '#45B7D1',
            type: 'enhancement'
          }
        ],
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        archived: false
      },
      {
        _id: new ObjectId(),
        title: 'Create API endpoints',
        description: 'Implement RESTful API endpoints for all core functionality',
        boardId: boardResult.insertedId.toString(),
        columnId: columnsResult.insertedIds[3], // Review
        sequence: 1,
        userId: userResult.insertedId.toString(),
        dateCreated: new Date(),
        dateUpdated: new Date(),
        assignedTo: [userResult.insertedId.toString()],
        labels: [
          {
            bg: '#96CEB4',
            type: 'task'
          }
        ],
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        archived: false
      },
      {
        _id: new ObjectId(),
        title: 'Write documentation',
        description: 'Create user guides and API documentation',
        boardId: boardResult.insertedId.toString(),
        columnId: columnsResult.insertedIds[4], // Done
        sequence: 1,
        userId: userResult.insertedId.toString(),
        dateCreated: new Date(),
        dateUpdated: new Date(),
        assignedTo: [userResult.insertedId.toString()],
        labels: [
          {
            bg: '#FFEAA7',
            type: 'documentation'
          }
        ],
        dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        archived: false
      }
    ];

    const cardsResult = await db.collection('cards').insertMany(sampleCards);
    console.log(`Created ${cardsResult.insertedCount} cards`);

    // Create sample comments
    console.log('Creating sample comments...');
    const sampleComments = [
      {
        _id: new ObjectId(),
        cardId: cardsResult.insertedIds[0], // Design homepage layout
        boardId: boardResult.insertedId.toString(),
        text: 'This is a great start! I think we should consider mobile responsiveness first.',
        authorId: userResult.insertedId.toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
        edited: false
      },
      {
        _id: new ObjectId(),
        cardId: cardsResult.insertedIds[0], // Design homepage layout
        boardId: boardResult.insertedId.toString(),
        text: 'Agreed, mobile-first approach would be best for our users.',
        authorId: userResult.insertedId.toString(),
        createdAt: new Date(Date.now() + 3600000), // 1 hour later
        updatedAt: new Date(Date.now() + 3600000),
        edited: false
      },
      {
        _id: new ObjectId(),
        cardId: cardsResult.insertedIds[2], // Setup database schema
        boardId: boardResult.insertedId.toString(),
        text: 'Remember to add indexes for better performance.',
        authorId: userResult.insertedId.toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
        edited: false
      }
    ];

    const commentsResult = await db.collection('comments').insertMany(sampleComments);
    console.log(`Created ${commentsResult.insertedCount} comments`);

    // Create sample activity log entries
    console.log('Creating sample activity log entries...');
    const sampleActivities = [
      {
        _id: new ObjectId(),
        boardId: boardResult.insertedId.toString(),
        actorId: userResult.insertedId.toString(),
        action: 'board_created',
        targetId: boardResult.insertedId.toString(),
        targetType: 'board',
        timestamp: new Date(),
        details: {
          boardName: 'Project Roadmap'
        }
      },
      {
        _id: new ObjectId(),
        boardId: boardResult.insertedId.toString(),
        actorId: userResult.insertedId.toString(),
        action: 'column_created',
        targetId: columnsResult.insertedIds[0].toString(),
        targetType: 'column',
        timestamp: new Date(),
        details: {
          columnName: 'Backlog'
        }
      },
      {
        _id: new ObjectId(),
        boardId: boardResult.insertedId.toString(),
        actorId: userResult.insertedId.toString(),
        action: 'card_created',
        targetId: cardsResult.insertedIds[0].toString(),
        targetType: 'card',
        timestamp: new Date(),
        details: {
          title: 'Design homepage layout',
          columnId: columnsResult.insertedIds[0].toString()
        }
      },
      {
        _id: new ObjectId(),
        boardId: boardResult.insertedId.toString(),
        actorId: userResult.insertedId.toString(),
        action: 'comment_added',
        targetId: commentsResult.insertedIds[0].toString(),
        targetType: 'comment',
        timestamp: new Date(),
        details: {
          cardTitle: 'Design homepage layout',
          commentText: 'This is a great start! I think we should consider mobile responsiveness first.'
        }
      }
    ];

    const activitiesResult = await db.collection('activityLog').insertMany(sampleActivities);
    console.log(`Created ${activitiesResult.insertedCount} activity log entries`);

    console.log('Database seeding completed successfully!');
    console.log('\nSample data created:');
    console.log(`- 1 User: ${sampleUser.email}`);
    console.log(`- 1 Board: ${sampleBoard.name}`);
    console.log(`- ${sampleColumns.length} Columns: ${sampleColumns.map(c => c.name).join(', ')}`);
    console.log(`- ${sampleCards.length} Cards across all columns`);
    console.log(`- ${sampleComments.length} Comments`);
    console.log(`- ${sampleActivities.length} Activity log entries`);

  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seeding function if this file is executed directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('\nSeed script completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seed script failed:', error);
      process.exit(1);
    });
}

export default seedDatabase;