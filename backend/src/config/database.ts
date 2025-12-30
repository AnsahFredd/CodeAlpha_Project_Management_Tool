import mongoose from "mongoose";
import config from "./index";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.mongodbUri);
    if (config.env === "development") {
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
