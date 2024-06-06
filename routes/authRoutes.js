// routes/authRoutes.js
import express from "express";
import cors from "cors";
import { test, registerUser, loginUser } from "../controllers/authController.js";

const router = express.Router();

// CORS middleware
router.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173", // Ensure this matches your frontend origin
  })
);

// Auth Routes
router.get('/', test);
router.post('/register', registerUser);
router.post('/login', loginUser);

export default router;
