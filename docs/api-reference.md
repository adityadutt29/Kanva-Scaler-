# API Reference

This document provides a reference for the main API endpoints of the Kanva application.

## Authentication

All API endpoints (except login and registration) require authentication via JWT token in cookies.

## Base URL

The base URL for all API endpoints is `/api`.

## Authentication Endpoints

### Register User
- **Endpoint**: `POST /api/register`
- **Description**: Register a new user account
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "securepassword",
    "fullName": "John Doe"
  }
  ```
- **Response**:
  ```json
  {
    "status": "success",
    "message": "User registered successfully"
  }
  ```

### Login User
- **Endpoint**: `POST /api/login`
- **Description**: Authenticate user and return JWT token
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "securepassword"
  }
 ```
- **Response**:
  ```json
  {
    "status": "success",
    "token": "jwt_token_string",
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "fullName": "John Doe"
    }
 }
  ```

### Logout User
- **Endpoint**: `POST /api/logout`
- **Description**: Logout user and clear session
- **Response**: 200 OK

## User Endpoints

### Get User Details
- **Endpoint**: `GET /api/users/:userId`
- **Description**: Get user details by ID
- **Response**:
 ```json
  {
    "id": "user_id",
    "email": "user@example.com",
    "fullName": "John Doe"
  }
 ```

## Board Endpoints

### Get User's Boards
- **Endpoint**: `GET /api/boards`
- **Description**: Get all boards for the authenticated user
- **Response**:
  ```json
  [
    {
      "_id": "board_id",
      "name": "Project Board",
      "createdBy": "user_id",
      "dateCreated": "2023-01-01T00:00:00.000Z",
      "backgroundImage": "image_url",
      "users": ["user_id1", "user_id2"]
    }
  ]
 ```

### Create Board
- **Endpoint**: `POST /api/boards`
- **Description**: Create a new board
- **Request Body**:
  ```json
  {
    "name": "New Project Board",
    "createdBy": "user_id"
  }
  ```
- **Response**: Created board object

### Get Board Details
- **Endpoint**: `GET /api/boards/:boardId`
- **Description**: Get board details by ID
- **Response**: Board object with all details

### Update Board
- **Endpoint**: `PUT /api/boards/:boardId`
- **Description**: Update board details
- **Request Body**: Board update object
- **Response**: Updated board object

### Delete Board
- **Endpoint**: `DELETE /api/boards/:boardId`
- **Description**: Delete a board
- **Response**: Deletion confirmation

## Column Endpoints

### Get Board Columns
- **Endpoint**: `GET /api/boards/:boardId/columns`
- **Description**: Get all columns for a board
- **Response**:
  ```json
  [
    {
      "_id": "column_id",
      "boardId": "board_id",
      "name": "To Do",
      "sequence": 1,
      "createdBy": "user_id",
      "date": "2023-01-01T00:00:00.000Z"
    }
 ]
  ```

### Create Column
- **Endpoint**: `POST /api/boards/:boardId/columns`
- **Description**: Create a new column in a board
- **Request Body**:
  ```json
  {
    "id": "column_id",
    "boardId": "board_id",
    "columnName": "New Column",
    "sequence": 1,
    "userId": "user_id"
  }
 ```
- **Response**: Created column object

## Card Endpoints

### Get Column Cards
- **Endpoint**: `GET /api/boards/:boardId/columns/:columnId/cards`
- **Description**: Get all cards in a specific column
- **Response**:
  ```json
  [
    {
      "_id": "card_id",
      "boardId": "board_id",
      "columnId": "column_id",
      "title": "Task 1",
      "description": "Description of task 1",
      "sequence": 1,
      "userId": "user_id",
      "dateCreated": "2023-01-01T00:00:00.000Z"
    }
 ]
  ```

### Create Card
- **Endpoint**: `POST /api/boards/:boardId/columns/:columnId/cards`
- **Description**: Create a new card in a column
- **Request Body**:
  ```json
  {
    "id": "card_id",
    "boardId": "board_id",
    "columnId": "column_id",
    "title": "New Task",
    "description": "Description of the task",
    "sequence": 1,
    "userId": "user_id"
  }
 ```
- **Response**: Created card object

### Update Card
- **Endpoint**: `PUT /api/boards/:boardId/cards/:cardId`
- **Description**: Update a card
- **Request Body**: Card update object
- **Response**: Updated card object

## Comment Endpoints

### Get Card Comments
- **Endpoint**: `GET /api/boards/:boardId/cards/:cardId/comments`
- **Description**: Get all comments for a card
- **Response**: Array of comment objects

### Add Comment to Card
- **Endpoint**: `POST /api/boards/:boardId/cards/:cardId/comments`
- **Description**: Add a comment to a card
- **Request Body**:
 ```json
  {
    "text": "This is a comment",
    "authorId": "user_id"
  }
  ```
- **Response**: Created comment object

### Update Comment
- **Endpoint**: `PUT /api/boards/:boardId/cards/:cardId/comments/:commentId`
- **Description**: Update a comment (only the author can update)
- **Request Body**:
  ```json
  {
    "text": "Updated comment text"
  }
 ```
- **Response**: Updated comment object

### Delete Comment
- **Endpoint**: `DELETE /api/boards/:boardId/cards/:cardId/comments/:commentId`
- **Description**: Delete a comment (only the author can delete)
- **Response**: Deletion confirmation

## Activity Log Endpoints

### Get Board Activity
- **Endpoint**: `GET /api/boards/:boardId/activity`
- **Description**: Get activity log for a board
- **Query Parameters**: `limit` (number, default 20, max 100)
- **Response**:
  ```json
  [
    {
      "_id": "activity_id",
      "boardId": "board_id",
      "actorId": "user_id",
      "action": "card_created",
      "targetId": "target_id",
      "targetType": "card",
      "timestamp": "2023-01-01T00:00:00.000Z",
      "details": {
        "title": "Task title",
        "columnId": "column_id"
      }
    }
 ]
  ```

## Error Responses

All API endpoints return appropriate HTTP status codes and error messages in the following format:

```json
{
  "msg": "Error message",
  "status": 500,
  "error": "Detailed error information"
}
```

### Common Status Codes:
- `200`: Success
- `400`: Bad Request (invalid input)
- `401`: Unauthorized (missing or invalid token)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found (resource does not exist)
- `405`: Method Not Allowed
- `500`: Internal Server Error