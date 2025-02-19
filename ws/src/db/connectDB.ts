import mongoose from "mongoose";

const connectDB = async (url: string): Promise<void> => {
  mongoose.connection.on("connected", () => {
    console.log("Connected to MongoDB Database");
  });

  try {
    await mongoose.connect(url);
  } catch (error) {
    console.error("Error Connecting to MongoDB:", error);
  }
};

export default connectDB;