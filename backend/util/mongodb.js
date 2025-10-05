import { MongoClient, ServerApiVersion } from 'mongodb';

// Prefer the explicit production URI, otherwise fall back to LOCAL_MONGODB or a sensible default for development
const MONGODB_URI = process.env.MONGODB_URI || process.env.LOCAL_MONGODB || 'mongodb://localhost:27017/kanva';
const MONGODB_DB = process.env.MONGODB_DB || 'kanva';

if (process.env.NODE_ENV === 'production') {
  if (!process.env.MONGODB_URI) {
    // In production we require explicit configuration
    throw new Error('Please define the MONGODB_URI environment variable inside .env or your hosting environment');
  }
  if (!process.env.MONGODB_DB) {
    throw new Error('Please define the MONGODB_DB environment variable inside .env or your hosting environment');
  }
} else {
  // In development, warn when defaults are used to help debugging but don't crash the server
  if (!process.env.MONGODB_URI) {
    // eslint-disable-next-line no-console
    console.warn('MONGODB_URI not set; falling back to LOCAL_MONGODB or default mongodb://localhost:27017/kanva');
  }
  if (!process.env.MONGODB_DB) {
    // eslint-disable-next-line no-console
    console.warn('MONGODB_DB not set; falling back to default "kanva"');
  }
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongo;

if (!cached) {
  cached = global.mongo = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const mongoURL = process.env.NODE_ENV === 'development' ? process.env.LOCAL_MONGODB || MONGODB_URI : process.env.MONGODB_URI || MONGODB_URI;

    // Create a new MongoClient and connect using Server API v1 to reduce
    // driver warnings and to have stable server behavior
    const client = new MongoClient(mongoURL, {
      // use the Stable Server API to avoid surprising behavior across server versions
      serverApi: ServerApiVersion.v1,
      // limit pool size in development to avoid too many concurrent connections
      maxPoolSize: process.env.NODE_ENV === 'development' ? 5 : 50
    });

    cached.promise = client
      .connect()
      .then(() => ({ client, db: client.db(MONGODB_DB) }))
      .catch((err) => {
        // Reset promise so future calls can retry
        cached.promise = null;
        throw err;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
