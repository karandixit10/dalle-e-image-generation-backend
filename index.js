import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import connectDb from "./mongodb/connect.js";
import postRoutes from "./routes/postRoutes.js";
import dalleRoutes from "./routes/dalleRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// CORS Middleware
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173", // Ensure this matches your frontend origin
  })
);

// Auth Routes
app.use('/', authRoutes);

// OpenAI Routes
app.use("/api/v1/posts", postRoutes); // Assuming postRoutes handle routes related to posts
app.use("/api/v1/dalle", dalleRoutes); // Routes related to DALL-E operations

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDb(process.env.MONGODB_URL);
    app.listen(8080, () =>
      console.log("Server is running on port 8080")
    );
  } catch (e) {
    console.log(e);
  }
};

// Start Server
startServer();
