import mongoose from "mongoose";
import Task from "./backend/src/models/Task";
import dotenv from "dotenv";
dotenv.config({ path: "./backend/.env" });

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log("Connected to DB");

    const testData = {
      title: "Test Task",
      project: new mongoose.Types.ObjectId(), // Mock project ID
      status: "todo",
      priority: "medium",
      dueDate: new Date("2026-01-15T05:00:00.000Z"), // ISO format as sent by frontend
    };

    console.log("Attempting to create task with:", testData);
    await Task.create(testData);
    console.log("Task created successfully");
  } catch (error) {
    console.error("Error creating task:", error);
  } finally {
    await mongoose.disconnect();
  }
};

run();
