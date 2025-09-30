import mongoose from "mongoose";

const MONGO = process.env.MONGO_URI as string;

if (!MONGO) {
  throw new Error(
    "Please define the MONGO_URI environment variable inside .env.local"
  );
}


let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO).then((mongoose) => {
      console.log(" Connected to MongoDB");
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

