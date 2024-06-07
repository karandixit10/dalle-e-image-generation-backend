import express from "express";
import cors from "cors";
import { test, registerUser, loginUser, getAllUsers, logoutUser, dashboard } from "../controllers/authController.js";
import authMiddleware from "../middleware/auth.js";

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
router.post('/login', loginUser);
router.post('/register', registerUser);
router.route("/dashboard").get(authMiddleware, dashboard);
router.get('/users', getAllUsers);
router.post('/logout', logoutUser);

export default router;
