import mongoose from "mongoose";

const connectDB = async () => {
  try {
    console.log("Connecting to MongoDB..."); // 👈 debug

    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB Atlas Connected Successfully");
  } catch (error) {
    console.error("MongoDB Connection Error:", error.message);
    process.exit(1);
  }
  console.log("Mongo URI:", process.env.MONGO_URI);
};

export default connectDB;
