import mongoose from "mongoose";
declare global { var mongooseConnection: Promise<typeof mongoose> | undefined; }
export async function connectDB() {
  if (!process.env.MONGO_URI) throw new Error("Falta configurar MONGO_URI.");
  global.mongooseConnection ??= mongoose.connect(process.env.MONGO_URI, { dbName: process.env.MONGO_DB_NAME || undefined });
  return global.mongooseConnection;
}
