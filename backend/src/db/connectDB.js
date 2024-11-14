import mongoose from "mongoose";

const connectDB = async (url) => {
    mongoose.connection.on('connected', () => {
        console.log("connected to MongoDB Database");
    })
    try {
        await mongoose.connect(url);
    } catch (error) {
        console.log("Error Connecting to MongoDB:", error);
    }
}

export default connectDB;