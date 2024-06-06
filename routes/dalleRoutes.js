import express from "express";
import cors from "cors";
import { test, dalleApi } from "../controllers/dalleController.js";

const router = express.Router();

// CORS middleware
router.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173", // Ensure this matches your frontend origin
  })
);

// DALL-E Routes
router.get('/', test);
router.post('/', dalleApi);

export default router;