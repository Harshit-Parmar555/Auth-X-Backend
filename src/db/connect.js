import mongoose from "mongoose";

// Database connection function
export const connectDb = async () => {
  try {
    // Set up event listeners before connecting
    mongoose.connection.on("connected", () => {
      console.log("Database connected successfully");
    });

    mongoose.connection.on("error", (error) => {
      console.error("Database connection error:", error);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("Database disconnected");
    });

    // Connect to the database
    await mongoose.connect(process.env.MONGO_URL);
  } catch (error) {
    console.error("Error in connecting with database:", error);
    process.exit(1);
  }
};
