import mongoose from "mongoose";

// ---------------------------------------------------------------------------
// Extend the global NodeJS namespace so TypeScript knows about our cached
// connection. This avoids "property does not exist on type Global" errors.
// ---------------------------------------------------------------------------
declare global {
  // eslint-disable-next-line no-var
  var mongoose: { conn: mongoose.Connection | null; promise: Promise<mongoose.Connection> | null };
}

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

/**
 * In development, Next.js hot-reloads modules, which would create a new
 * connection on every file change. We cache the connection on `global` so
 * it survives across hot-reloads without leaking connections.
 *
 * In production this pattern is harmless — the module is loaded once.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB(): Promise<mongoose.Connection> {
  // If we already have a live connection, return it immediately.
  if (cached.conn) return cached.conn;

  // If a connection is in-flight (e.g. two API routes hit simultaneously),
  // wait for the same promise rather than opening two connections.
  if (!cached.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false, // fail fast instead of queuing queries
    };

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((m) => m.connection);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;