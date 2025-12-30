import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGODB_URI ||
        "mongodb://localhost:27017/project-management-tool"
    );
    if (process.env.NODE_ENV === "development") {
      console.log(`MongoDB Connected: ${conn.connection.host}`);
    } else {
      console.log("MongoDB Connected successfully");
    }
  } catch (error: any) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
