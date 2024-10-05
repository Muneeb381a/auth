import express from "express"
import { connectDB } from "./db/connectDB.js";
import dotenv from "dotenv"

dotenv.config();

import authRoutes from "./routes/auth.route.js"
const app = express();

const PORT = process.env.PORT || 8000

app.use(express.json());

app.use("/api/auth", authRoutes)

app.listen(PORT, () => {
    connectDB()
    console.log(`server is running on ${PORT}`);
})