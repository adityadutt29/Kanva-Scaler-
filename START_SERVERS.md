# How to Start the Kanva Application

## ⚠️ IMPORTANT: You must start servers from their specific directories!

Open **two separate terminal windows/tabs**.

### Terminal 1: Start Backend Server (Port 3001)
```bash
cd /Users/adityadutt29/Downloads/kanva-develop/backend
npm run dev
```

**Expected Output:**
```
> Ready on http://localhost:3001
```

Keep this terminal open to see backend API logs and errors.

---

### Terminal 2: Start Frontend Dev Server (Port 3000)
```bash
cd /Users/adityadutt29/Downloads/kanva-develop/frontend
npm run dev
```

**Expected Output:**
```
- ready started server on 0.0.0.0:3000
- Local:        http://localhost:3000
```

---

## Access the Application

Once both servers are running:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001

The frontend will automatically make API calls to the backend on port 3001 (configured via `NEXT_PUBLIC_API_URL` in `frontend/.env.local`).

---

## Production Mode (Single Server)

To run in production mode (backend serves both API and static frontend):

```bash
# First, build the frontend
cd frontend
npm run build

# Then start the backend in production mode
cd ../backend
npm run start
```

Access the application at: http://localhost:3001

---

## Troubleshooting

### Port Already in Use
If you see `EADDRINUSE` errors:

```bash
# Check what's using the ports
lsof -i :3000
lsof -i :3001

# Kill the process (replace PID with the actual process ID)
kill -9 <PID>
```

### CORS / Fetch Errors
- Verify backend is running on port 3001
- Check `frontend/.env.local` has: `NEXT_PUBLIC_API_URL=http://localhost:3001`
- Verify `backend/.env` has: `ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001`

### MongoDB Connection Errors
- Ensure MongoDB is running: `lsof -i :27017`
- Start MongoDB if needed: `brew services start mongodb-community` (macOS with Homebrew)
- Check `backend/.env` has correct `MONGODB_URI` and `MONGODB_DB`

---

## Environment Configuration Summary

### Backend (`backend/.env`)
```env
PORT=3001
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB=kanva
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

### Frontend (`frontend/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_WEBSOCKET_URL=http://localhost:3001
```
