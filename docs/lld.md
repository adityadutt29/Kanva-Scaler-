# Low-Level Design (LLD) - Kanva

## Overview
This document provides detailed low-level design specifications for the Kanva application, including API endpoint definitions, database schema, and implementation details.

## API Endpoint Definitions

### Authentication Endpoints

#### `POST /api/register`
- **Description**: Register a new user
- **Request Body**:
  ```json
  {
    "email": "string",
    "password": "string",
    "fullName": "string"
  }
  ```
- **Response**:
  ```json
  {
    "status": "success",
    "message": "User registered successfully"
  }
  ```
- **Response Codes**: 200 (Success), 400 (Bad Request), 500 (Server Error)

#### `POST /api/login`
- **Description**: Authenticate user and return JWT token
- **Request Body**:
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Response**:
  ```json
  {
    "status": "success",
    "token": "string",
    "user": {
      "id": "string",
      "email": "string",
      "fullName": "string"
    }
  }
  ```
- **Response Codes**: 200 (Success), 401 (Unauthorized), 500 (Server Error)

#### `POST /api/logout`
- **Description**: Logout user and clear session
- **Response**: 200 (Success)

### User Endpoints

#### `GET /api/users/:slug`
- **Description**: Get user details by ID
- **Response**:
  ```json
  {
    "id": "string",
    "email": "string",
    "fullName": "string"
  }
  ```
- **Response Codes**: 200 (Success), 401 (Unauthorized), 404 (Not Found)

### Board Endpoints

#### `GET /api/boards`
- **Description**: Get all boards for the authenticated user
- **Response**:
 ```json
  [
    {
      "_id": "string",
      "name": "string",
      "createdBy": "string",
      "dateCreated": "string",
      "backgroundImage": "string",
      "users": ["string"]
    }
  ]
 ```
- **Response Codes**: 200 (Success), 401 (Unauthorized)

#### `POST /api/boards`
- **Description**: Create a new board
- **Request Body**:
  ```json
  {
    "name": "string",
    "createdBy": "string",
    "workspaceId": "string" (optional)
  }
  ```
- **Response**: 200 (Success) with created board object

#### `GET /api/boards/:slug`
- **Description**: Get board details by ID
- **Response**: Board object with all details
- **Response Codes**: 200 (Success), 401 (Unauthorized), 404 (Not Found)

#### `PUT /api/boards/:slug`
- **Description**: Update board details
- **Request Body**: Board update object
- **Response**: Updated board object
- **Response Codes**: 200 (Success), 401 (Unauthorized), 404 (Not Found)

#### `DELETE /api/boards/:slug`
- **Description**: Delete a board
- **Response**: 200 (Success) with deletion confirmation
- **Response Codes**: 200 (Success), 401 (Unauthorized), 404 (Not Found)

### Column Endpoints

#### `GET /api/boards/:slug/columns`
- **Description**: Get all columns for a board
- **Response**:
  ```json
  [
    {
      "_id": "string",
      "boardId": "string",
      "name": "string",
      "sequence": "number",
      "createdBy": "string",
      "date": "Date"
    }
 ]
  ```
- **Response Codes**: 200 (Success), 401 (Unauthorized)

#### `POST /api/boards/:slug/columns`
- **Description**: Create a new column
- **Request Body**:
  ```json
  {
    "id": "string",
    "boardId": "string",
    "columnName": "string",
    "sequence": "number",
    "userId": "string"
  }
  ```
- **Response**: Created column object
- **Response Codes**: 200 (Success), 401 (Unauthorized)

### Card Endpoints

#### `GET /api/boards/:slug/columns/:cid/cards`
- **Description**: Get all cards in a specific column
- **Response**:
 ```json
  [
    {
      "_id": "string",
      "boardId": "string",
      "columnId": "string",
      "title": "string",
      "description": "string",
      "sequence": "number",
      "userId": "string",
      "dateCreated": "string"
    }
  ]
  ```
- **Response Codes**: 200 (Success), 401 (Unauthorized)

#### `POST /api/boards/:slug/columns/:cid/cards`
- **Description**: Create a new card in a column
- **Request Body**:
  ```json
  {
    "id": "string",
    "boardId": "string",
    "columnId": "string",
    "title": "string",
    "description": "string",
    "sequence": "number",
    "userId": "string"
  }
  ```
- **Response**: Created card object
- **Response Codes**: 200 (Success), 401 (Unauthorized)

#### `PUT /api/boards/:slug/cards/:cardId`
- **Description**: Update a card
- **Request Body**: Card update object
- **Response**: Updated card object
- **Response Codes**: 200 (Success), 401 (Unauthorized), 404 (Not Found)

### Comment Endpoints

#### `GET /api/boards/:slug/cards/:cardId/comments`
- **Description**: Get all comments for a card
- **Response**: Array of comment objects
- **Response Codes**: 200 (Success), 401 (Unauthorized)

#### `POST /api/boards/:slug/cards/:cardId/comments`
- **Description**: Add a comment to a card
- **Request Body**: Comment object
- **Response**: Created comment object
- **Response Codes**: 200 (Success), 401 (Unauthorized)

#### `PUT /api/boards/:slug/cards/:cardId/comments/:commentId`
- **Description**: Update a comment
- **Request Body**: Updated comment text
- **Response**: Updated comment object
- **Response Codes**: 200 (Success), 401 (Unauthorized), 403 (Forbidden - not author), 404 (Not Found)

#### `DELETE /api/boards/:slug/cards/:cardId/comments/:commentId`
- **Description**: Delete a comment
- **Response**: Deletion confirmation
- **Response Codes**: 200 (Success), 401 (Unauthorized), 403 (Forbidden - not author), 404 (Not Found)

### Activity Log Endpoints

#### `GET /api/boards/:slug/activity`
- **Description**: Get activity log for a board
- **Query Parameters**: `limit` (number, default 20, max 100)
- **Response**:
  ```json
  [
    {
      "_id": "string",
      "boardId": "string",
      "actorId": "string",
      "action": "string",
      "targetId": "string",
      "targetType": "string",
      "timestamp": "Date",
      "details": "object"
    }
  ]
  ```
- **Response Codes**: 200 (Success), 401 (Unauthorized), 404 (Not Found)

## Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  email: String,           // Unique, indexed
  password: String,        // Hashed password
  fullName: String,
  dateCreated: Date,
  avatar: String,          // Optional
  isActive: Boolean        // Default: true
}
```
- **Indexes**: 
  - `email`: Unique index for quick lookups and uniqueness constraint

### Boards Collection
```javascript
{
  _id: ObjectId,
  name: String,
  createdBy: String,       // User ID
  dateCreated: Date,
 backgroundImage: String, // Optional
  users: [String],         // Array of user IDs with access
  workspaceId: String,     // Optional reference to workspace
  settings: {              // Optional board settings
    cardSorting: String,   // Default: "manual", could be "date", "priority"
    permissions: Object    // Who can edit, comment, etc.
  }
}
```
- **Indexes**:
  - `createdBy`: Index for user's boards lookup
 - `users`: Index for shared board access
  - `workspaceId`: Index for workspace boards lookup

### Columns Collection
```javascript
{
  _id: ObjectId,
  boardId: String,         // Reference to board
  name: String,
  sequence: Number,        // For ordering (fractional indexing)
  createdBy: String,       // User ID
  date: Date,
  archived: Boolean        // Default: false
}
```
- **Indexes**:
  - `boardId`: Index for board columns lookup
  - `sequence`: Index for ordering
  - Compound: `boardId` + `sequence` for efficient board column retrieval with ordering

### Cards Collection
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  boardId: String,         // Reference to board
  columnId: String,        // Reference to column
  sequence: Number,        // For ordering within column (fractional indexing)
 userId: String,          // Creator ID
  dateCreated: Date,
  dateUpdated: Date,
  assignedTo: [String],    // Array of user IDs
  labels: [{               // Optional card labels
    bg: String,
    type: String
 }],
  dueDate: Date,           // Optional
  archived: Boolean        // Default: false
}
```
- **Indexes**:
  - `boardId`: Index for board cards lookup
  - `columnId`: Index for column cards lookup
  - `sequence`: Index for card ordering
  - Compound: `boardId` + `columnId` + `sequence` for efficient card retrieval with ordering
  - `assignedTo`: Index for assigned cards lookup

### Comments Collection
```javascript
{
  _id: ObjectId,
  cardId: String,          // Reference to card
  boardId: String,         // Reference to board (for indexing)
  text: String,
  authorId: String,        // User ID
  createdAt: Date,
  updatedAt: Date,
  edited: Boolean          // Default: false
}
```
- **Indexes**:
  - `cardId`: Index for card comments lookup
 - `boardId`: Index for board comments lookup
  - `authorId`: Index for user comments lookup
  - Compound: `cardId` + `createdAt` for chronological comment retrieval

### Workspaces Collection
```javascript
{
  _id: ObjectId,
 name: String,
 ownerId: String,         // User ID
  members: [String],       // Array of user IDs
 dateCreated: Date,
  settings: Object         // Workspace-specific settings
}
```
- **Indexes**:
  - `ownerId`: Index for user's owned workspaces
  - `members`: Index for user's workspaces

### ActivityLog Collection
```javascript
{
  _id: ObjectId,
  boardId: String,         // Reference to board
  actorId: String,         // User ID who performed action
  action: String,          // Type of action (card_created, comment_added, etc.)
  targetId: String,        // ID of the target (card ID, column ID, etc.)
  targetType: String,      // Type of target (card, column, comment, etc.)
  timestamp: Date,
  details: Object          // Additional action-specific details
}
```
- **Indexes**:
  - `boardId`: Index for board activity lookup
  - `timestamp`: Index for chronological sorting
  - Compound: `boardId` + `timestamp` for efficient activity log retrieval

## Ordering Strategy (Fractional Positions)

### Implementation
The application uses fractional indexing to maintain the order of cards within columns and columns within boards. This approach allows for efficient insertion of new items without requiring a full reordering of existing items.

### Algorithm
1. **Initial Setup**: Items are assigned integer positions (0, 1, 2, ...)
2. **Insertion**: When inserting an item between two existing items:
   - Calculate the fractional position as the average of the positions of adjacent items
   - If inserting between positions A and B, new position = (A + B) / 2
   - If inserting at the beginning, new position = A / 2 (where A is the first item's position)
   - If inserting at the end, new position = A + 1 (where A is the last item's position)
3. **Collision Handling**: If fractional positions become too close (precision limits), the system performs a full renumbering of the sequence
4. **Database Storage**: Positions are stored as floating-point numbers in the `sequence` field

### Benefits
- **Efficient Insertions**: O(1) insertion time without requiring updates to other items
- **Scalability**: Works well with large numbers of items
- **Flexibility**: Allows for reordering by simply updating the sequence value

### Considerations
- **Precision**: JavaScript floating-point precision limits the number of consecutive insertions between two items
- **Renumbering**: Periodic full renumbering may be required when precision becomes an issue

## Error Handling Model

### Frontend Error Handling
1. **API Call Errors**: 
   - Use try-catch blocks in async functions
   - Display user-friendly error messages using notifications/toasts
   - Log errors for debugging purposes
   - Implement retry mechanisms for transient failures

2. **Form Validation**:
   - Client-side validation before API calls
   - Real-time validation feedback
   - Server-side validation for security

3. **Network Errors**:
   - Handle offline states gracefully
   - Implement optimistic updates with error rollback
   - Provide clear feedback for network issues

### Backend Error Handling
1. **API Route Errors**:
   - Wrap all operations in try-catch blocks
   - Return appropriate HTTP status codes
   - Provide meaningful error messages
   - Log errors with context for debugging

2. **Database Errors**:
   - Handle connection failures gracefully
   - Implement retry logic for transient database issues
   - Validate inputs before database operations
   - Use transactions for complex operations

3. **Authentication Errors**:
   - Verify JWT tokens on protected routes
   - Return 401 for invalid/missing tokens
   - Implement token refresh mechanisms if needed

### Error Response Format
```json
{
  "error": "Error message",
  "status": 500,
  "timestamp": "ISO date string"
}
```

## Key Classes/Modules

### WebSocket Server (`util/websocket-server.ts`)
- **Purpose**: Manages WebSocket connections and real-time communication
- **Key Methods**:
  - `setupConnectionHandler()`: Sets up authentication and connection handling
  - `broadcastToBoard()`: Sends messages to all clients in a board room
- **Features**: Room-based broadcasting, JWT authentication, connection management

### WebSocket Broadcaster (`util/websocket-broadcaster.ts`)
- **Purpose**: Provides functions to broadcast specific events to connected clients
- **Key Functions**:
  - `broadcastCardMove()`: Broadcasts card movement events
  - `broadcastCommentAdded()`: Broadcasts comment addition events
  - `broadcastCardUpdate()`: Broadcasts card update events
  - `broadcastCardDelete()`: Broadcasts card deletion events

### Activity Logger (`util/activity-logger.ts`)
- **Purpose**: Logs user activities in the database
- **Key Functions**:
  - `logActivity()`: Records an activity in the database
  - `getActivityLog()`: Retrieves activity logs for a board

### Database Connection (`util/mongodb.js`)
- **Purpose**: Manages MongoDB connections with caching for performance
- **Features**: Singleton pattern, connection caching, environment-specific configuration

### Authentication Utilities (`util/verify-jwt-token.ts`)
- **Purpose**: Handles JWT token verification and user identification
- **Key Function**: `verifyTokenAndGetUserId()`: Verifies token and returns user ID

### Redux Slices
- **`src/slices/board.ts`**: Manages board state and activity log
- **`src/slices/boards.ts`**: Manages list of boards
- **`src/slices/cards.ts`**: Manages cards state and operations
- **`src/slices/columns.ts`**: Manages columns state and operations
- **`src/slices/user.ts`**: Manages current user state
- **`src/slices/users.ts`**: Manages users state
- **`src/slices/websocket.ts`**: Manages WebSocket connection state

### React Hooks
- **`src/hooks/useWebSocket.ts`**: Manages WebSocket connection lifecycle and message handling