# High-Level Design (HLD) - Kanva

## Overview
This document outlines the high-level architecture and design of the Kanva application. The application is a collaborative project management tool that allows users to create boards, lists (columns), and cards to organize and track their work.

## Architecture Diagram

```mermaid
graph TB
    subgraph "Client Layer"
        A[React/Next.js Frontend]
        B[Redux Toolkit State Management]
        C[WebSocket Client]
    end
    
    subgraph "Server Layer"
        D[Next.js API Routes]
        E[Authentication Service]
        F[WebSocket Server]
    end
    
    subgraph "Data Layer"
        G[MongoDB Database]
        H[Activity Log]
    end
    
    subgraph "External Services"
        I[Email Service - SMTP (Nodemailer)]
        J[Image Service - Unsplash]
    end
    
    A --> D
    A --> C
    B --> A
    C --> F
    D --> E
    D --> G
    D --> H
    F --> G
    E --> G
    I --> D
    J --> D
```

## Major Components

### 1. Frontend (React/Next.js)
- **Technology Stack**: React 18, Next.js 13, TypeScript
- **State Management**: Redux Toolkit with RTK Query
- **UI Components**: Material-UI (MUI) components
- **Real-time Updates**: WebSocket connections via Socket.IO client
- **Routing**: Next.js file-based routing system

### 2. Backend API (Next.js API Routes)
- **Technology Stack**: Next.js API routes, Node.js
- **Authentication**: JWT-based authentication with middleware
- **Database Access**: MongoDB with native driver
- **API Structure**: RESTful API endpoints following Next.js conventions
- **Business Logic**: Encapsulated in individual API route handlers

### 3. WebSocket Server
- **Technology**: Socket.IO for real-time communication
- **Purpose**: Real-time updates for card movements, comments, and other collaborative features
- **Authentication**: JWT token verification for WebSocket connections
- **Room Management**: Board-specific rooms for targeted updates

### 4. Database (MongoDB)
- **Technology**: MongoDB with native Node.js driver
- **Collections**: Users, Boards, Columns, Cards, Comments, Workspaces, Activity Log
- **Connection Management**: Singleton pattern with connection pooling
- **Environment Support**: Different configurations for development and production

## Data Flow

### Sidebar and Navigation
- The application uses a responsive, collapsible sidebar. The sidebar state (collapsed/expanded) is persisted to localStorage so user preference survives page reloads.
- The `NavBar` component accepts a `compact` prop and adapts its UI when the sidebar is collapsed.

### 1. User Authentication Flow
1. User submits credentials via login form
2. Frontend sends credentials to `/api/login` endpoint
3. Backend verifies credentials against MongoDB users collection
4. Backend generates JWT token and sets it as an HTTP-only cookie
5. Frontend receives confirmation and redirects to dashboard
6. Subsequent requests include JWT token for authentication

### 2. Board Collaboration Flow
1. Multiple users join the same board
2. Each user connects to WebSocket server and joins board-specific room
3. When one user makes changes (moves card, adds comment), the API route processes the change
4. API route updates MongoDB database
5. API route logs the activity in activity log collection
6. API route broadcasts the change via WebSocket to all users in the board room
7. All connected clients receive the update and update their UI accordingly

### 3. Real-time Updates Flow
1. User performs an action (e.g., moves a card)
2. Frontend sends request to appropriate API endpoint
3. Backend processes the request and updates the database
4. Backend calls WebSocket broadcaster to send update to all connected clients
5. WebSocket server sends the update to all clients in the board room
6. Other clients receive the WebSocket message and update their UI in real-time

## Technology Justification: Real-time Communication

### WebSocket via Socket.IO

**Why Socket.IO was chosen:**
1. **Reliability**: Socket.IO provides fallback mechanisms (polling) when WebSockets aren't available
2. **Easy Integration**: Simple to integrate with existing Next.js applications
3. **Room-based Broadcasting**: Perfect for board-specific updates
4. **Authentication Support**: Built-in authentication middleware support
5. **Automatic Reconnection**: Handles network interruptions gracefully
6. **Event-based Communication**: Natural fit for collaborative features

**Alternatives Considered:**
- Server-Sent Events (SSE): Unidirectional communication, doesn't support bidirectional updates needed for collaboration
- Raw WebSockets: More complex implementation, lacks built-in features like rooms and reconnection
- Polling: Inefficient for real-time updates, higher server load

## Deployment Strategy

### Architecture
- **Frontend/Server**: Next.js application deployed as a single unit
- **Database**: MongoDB Atlas (cloud) or self-hosted MongoDB instance
- **WebSocket**: Integrated into the main Next.js server process
- **Static Assets**: Served by Next.js or CDN (like Vercel's CDN)

### Environment Configuration
- **Development**: Local MongoDB instance, WebSocket on localhost
- **Staging**: Separate staging environment with staging database
- **Production**: Production MongoDB cluster, optimized WebSocket configuration

### Scaling Considerations
- **Horizontal Scaling**: Multiple server instances with shared MongoDB and Redis for WebSocket adapter
- **Database Scaling**: MongoDB sharding for large datasets
- **WebSocket Scaling**: Redis adapter for multi-server WebSocket communication
- **CDN Integration**: For serving static assets and images

### Security
- **HTTPS**: Mandatory for production deployment
- **JWT Security**: HTTP-only cookies to prevent XSS attacks
- **Input Validation**: Server-side validation for all API inputs
- **CORS**: Properly configured for frontend domain access
- **Authentication**: JWT token verification on all protected routes