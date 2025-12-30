import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import connectDB from "./config/database";

// Connect to database
const startServer = async () => {
  const PORT = process.env.PORT || 5000;
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

startServer();
