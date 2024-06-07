import UserSchema from "../mongodb/models/user.js";
import { hashPassword, comparePasswords } from "../helpers/auth.js";

import jwt from "jsonwebtoken";

// controllers/authController.js
export const test = (req, res) => {
  res.json({ message: "Hello for Authentication!" });
};

// Login function
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email || !password) {
    return res.status(400).json({
      msg: "Email and Password is required",
    });
  }

  // Find the user by email
  let user = await UserSchema.findOne({ email: req.body.email });
  if (user) {
    // Compare the provided password with the stored password
    const isMatch = await comparePasswords(password, user.password);

    if (isMatch) {
      // Generate a JWT token if password matches
      const token = jwt.sign(
        {email: user.email, id: user._id, name: user.name },
        process.env.JWT_SECRET,
        {
          expiresIn: "30d",
        }
      );

      // Respond with success message and token
      return res.status(200).json({ msg: "user logged in", token });
    } else {
      // Respond with error message if password does not match
      return res.status(400).json({ msg: "Bad password" });
    }
  } else {
    // Respond with error message if user not found
    return res.status(400).json({ msg: "Bad credentials" });
  }
};

// Dashboard function
export const dashboard = async (req, res) => {
  // Generate a random lucky number
  const luckyNumber = Math.floor(Math.random() * 100);

  // Respond with a message including the user's name and lucky number
  res.status(200).json({
    msg: `Hello, ${req.user.name}`,
    secret: `Here is your authorized data, your lucky number is ${luckyNumber}`,
  });
};

// Get all users function
export const getAllUsers = async (req, res) => {
  // Retrieve all users from the database
  let users = await User.find({});

  // Respond with the list of users
  return res.status(200).json({ users });
};

// Register function
export const registerUser = async (req, res) => {
  // Check if the user with the provided email already exists
  let user = await User.findOne({ email: req.body.email });
  if (user === null) {
    let { username, email, password } = req.body;
    
    // Check if all required fields are provided
    if (username.length && email.length && password.length) {
      // Create a new user
      const person = new User({
        name: username,
        email: email,
        password: password,
      });
      
      // Save the new user to the database
      await person.save();
      
      // Respond with the created user
      return res.status(201).json({ person });
    } else {
      // Respond with error message if required fields are missing
      return res.status(400).json({ msg: "Please add all values in the request body" });
    }
  } else {
    // Respond with error message if email is already in use
    return res.status(400).json({ msg: "Email already in use" });
  }
};

export const logoutUser = (req, res) => {
  // Clear token from client's cookies or session storage
  res.clearCookie('token'); // Example for clearing cookie

  // Respond with success message
  return res.status(200).json({ msg: "Logged out successfully" });
}