
import mongoose from "mongoose";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Use globalThis to persist cache across hot reloads
const globalCache = globalThis as typeof globalThis & {
  mongoose?: MongooseCache;
};

// MongoDB URI
const MONGO = process.env.MONGO_URI;

if (!MONGO) {
  throw new Error(
    "Please define the MONGO_URI environment variable inside .env.local"
  );
}

// Initialize cache if it doesn't exist
if (!globalCache.mongoose) {
  globalCache.mongoose = { conn: null, promise: null };
}

const cached = globalCache.mongoose;

// Connect to MongoDB
export async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO!).then((mongooseInstance) => {
      console.log("Connected to MongoDB");
      return mongooseInstance;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
