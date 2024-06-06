import express from "express";
import { getPosts, createPost } from "../controllers/postController.js";

const router = express.Router();

// Define route for fetching posts
router.route("/").get(getPosts);

// Define route for creating a new post
router.route("/").post(createPost);

export default router;
