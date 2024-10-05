import express from "express"
import { connectDB } from "./db/connectDB.js";
import dotenv from "dotenv"

dotenv.config();

import authRoutes from "./routes/auth.route.js"
const app = express();

app.get("/", (req, res) => {
    res.send("Hi there")
})

app.use("/api/auth", authRoutes)

app.listen(8000, () => {
    connectDB()
    console.log("server is running on port");
})