import mongoose from "mongoose";

async function mongoDb() {
  try {
    await mongoose.connect(process.env.MONGODB_CONNECTION_STRING);
    console.log(`MongoDB Connected: ${mongoose.connection.host}`);
  } catch (error) {
    console.log(error);
  }
}

export default mongoDb;
