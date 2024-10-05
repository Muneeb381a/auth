import mongoose from "mongoose"

export const connectDB = async() => {
    try {
       const connection =  await mongoose.connect(process.env.MONGODB_URI)
       console.log(`MongoDB connected ${connection.connection.host}`);
       
    } catch (error) {
        console.log("Error occured while connecting to mongoDB", error.message);
        process.exit(1)
    }
}