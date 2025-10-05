import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { initializeWebSocketServer } from './util/websocket-broadcaster.ts';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = parseInt(process.env.PORT || '3001', 10);

// In development, we only serve API routes
// In production, we serve both API routes and the built frontend
const frontendDir = path.join(__dirname, '../frontend');

console.log(`Starting server in ${dev ? 'development' : 'production'} mode`);
if (!dev) {
  console.log(`Frontend directory: ${frontendDir}`);
}

const app = next({
  dev,
  hostname,
  port,
  dir: dev ? __dirname : frontendDir, // In dev, use backend dir (API only); in prod, use frontend dir
  conf: {
    distDir: dev ? '.next' : '.next' // Use default .next directory
  }
});
const handle = app.getRequestHandler();

console.log('Next.js app created, preparing...');

// Add process-level error handlers to prevent silent crashes
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

app.prepare().then(() => {
  console.log('Next.js app prepared successfully');
  
  // Create an HTTP server
  const server = createServer(async (req, res) => {
    try {
      // Add CORS headers to all responses
      res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
      res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,PATCH,OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      res.setHeader('Access-Control-Allow-Credentials', 'true');

      // Handle OPTIONS preflight requests
      if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
      }

      // Be sure to pass `true` as the second argument to `url.parse`.
      // This tells it to parse the query portion of the URL.
      const parsedUrl = parse(req.url, true);
      const { pathname } = parsedUrl;

      // In development mode, only handle API routes
      // In production mode, handle both API routes and frontend pages
      if (pathname.startsWith('/api')) {
        await handle(req, res, parsedUrl);
      } else if (dev) {
        // In development, reject non-API requests (frontend runs separately on port 3000)
        res.writeHead(404);
        res.end('Not Found - Frontend should be running on http://localhost:3000');
      } else {
        // In production, serve the frontend
        await handle(req, res, parsedUrl);
      }
    } catch (err) {
      console.error('Error occurred handling request:', err);
      res.statusCode = 500;
      res.end('Internal Server Error');
    }
  });

  // Initialize WebSocket server
  initializeWebSocketServer(server);

  // Start listening on the specified port
  server.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });
}).catch((err) => {
  console.error('Failed to prepare Next.js app:', err);
  process.exit(1);
});