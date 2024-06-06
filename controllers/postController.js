import * as dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import Post from "../mongodb/models/post.js";

// Load environment variables from .env file
dotenv.config();

// Configure Cloudinary with credentials from environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Controller to handle fetching all posts
const getPosts = async (req, res) => {
  try {
    // Fetch all posts from the database
    const posts = await Post.find({});
    // Respond with the fetched posts
    res.status(200).json({ success: true, data: posts });
  } catch (err) {
    // Handle errors and respond with an error message
    res.status(500).json({
      success: false,
      message: "Fetching posts failed, please try again",
    });
  }
};

// Controller to handle creating a new post
const createPost = async (req, res) => {
  try {
    const { name, prompt, photo } = req.body;
    // Upload photo to Cloudinary and get the URL
    const photoUrl = await cloudinary.uploader.upload(photo);
    // Create a new post in the database with the provided details and uploaded photo URL
    const newPost = await Post.create({
      name,
      prompt,
      photo: photoUrl.url,
    });
    // Respond with the newly created post
    res.status(200).json({ success: true, data: newPost });
  } catch (err) {
    // Handle errors and respond with an error message
    res.status(500).json({
      success: false,
      message: "Unable to create a post, please try again",
    });
  }
};

// Export the controller functions
export { getPosts, createPost };
