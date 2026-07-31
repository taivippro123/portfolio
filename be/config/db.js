import mongoose from "mongoose";
import dotenv from "dotenv";
import dns from 'dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);
dotenv.config();

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error("MONGO_URI is not set");
      return;
    }
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    });
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    // Don't exit - allow server to run without DB for health checks
    console.log("Server will continue running without database connection");
  }
};

export default connectDB;