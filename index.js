import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";

import connectDb from "./mongodb/connect.js";
import postRoutes from "./routes/postRoutes.js";
import dalleRoutes from "./routes/dalleRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();

// Global CORS configuration, if needed
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

//middleware
app.use(express.json({ limit: "50mb" }));

app.use('/', authRoutes);
app.use('/register', authRoutes);
app.use('/login', authRoutes);

app.use("/api/v1/posts", postRoutes);
app.use("/api/v1/dalle", dalleRoutes);

const startServer = async () => {
  try {
    await connectDb(process.env.MONGODB_URL);
    app.listen(8080, () =>
      console.log("Server is running on port 8080")
    );
  } catch (e) {
    console.log(e);
  }
};

startServer();
