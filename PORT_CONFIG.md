# Port Configuration

This application uses separate ports for backend and frontend to avoid conflicts:

## Development Mode

- **Backend Server**: `http://localhost:3001` (Custom Next.js server + API routes)
- **Frontend Dev Server**: `http://localhost:3000` (served by backend in production)

## Environment Variables

### Backend (.env in /backend/)
```bash
PORT=3001
```

### Frontend (.env.local in /frontend/)
```bash
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_WEBSOCKET_URL=http://localhost:3001
```

## Running the Application

### Production Mode (Single Server)
```bash
# From root directory
npm run build  # Build frontend first
npm start      # Start backend server on port 3001 serving the built frontend
```

Access the application at: `http://localhost:3001`

### Development Mode (Separate Servers)
```bash
# From root directory
npm run dev    # Starts both frontend (3000) and backend (3001) concurrently
```

Or manually:
```bash
# Terminal 1 - Frontend
cd frontend && npm run dev

# Terminal 2 - Backend  
cd backend && npm run dev
```

## Architecture

- **Backend (Port 3001)**: 
  - Custom Next.js server
  - API routes (`/api/*`)
  - WebSocket server
  - Serves static frontend in production

- **Frontend (Port 3000 in dev)**:
  - Next.js pages and components
  - API calls proxied to backend (3001)
  - WebSocket connections to backend (3001)
