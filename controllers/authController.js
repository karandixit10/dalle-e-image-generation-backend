import UserSchema from "../mongodb/models/user.js";
import { hashPassword, comparePasswords } from "../helpers/auth.js";

import jwt from "jsonwebtoken";

// controllers/authController.js
const test = (req, res) => {
  res.json({ message: "Hello for Authentication!" });
};

//Register EndPoint
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation for name
    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    // Validation for password
    if (!password || password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    // Check if the email already exists
    const exist = await UserSchema.findOne({ email });
    if (exist) {
      return res.status(400).json({ message: "Email already exists" });
    }

    //Encrpt Password
    const hashedPassword = await hashPassword(password);

    // Create new user
    const user = await UserSchema.create({
      name,
      email,
      password: hashedPassword,
    });

    return res.status(201).json(user); // Return status 201 for successful creation
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" }); // Return status 500 for internal server error
  }
};

//Login Endpoint
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    //Check if user exists
    const user = await UserSchema.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    //Compare Passwords
    const isMatch = await comparePasswords(password, user.password);
    if (isMatch) {
      //JWT Authentication
      jwt.sign(
        { email: user.email, id: user._id, name: user.name },
        process.env.JWT_SECRET,
        {},
        (err, token) => {
          if (err) throw err;
          res.status(200).cookie("token", token).json(user);
        }
      );
    } else {
      return res.status(400).json({ message: "Passwords do not match" });
    }
  } catch (error) {
    console.log(error);
  }
};

const getProfile = (req, res) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  jwt.verify(token, process.env.JWT_SECRET, {}, (err, user) => {
    if (err) {
      // Handle JWT verification errors
      console.error("JWT verification error:", err);
      return res.status(401).json({ message: 'Unauthorized' });
    }
    // If JWT verification is successful, return user data
    res.status(200).json(user);
  });
};

const logoutUser = (req, res) => {
  try {
    // Clear the JWT token from the client-side (cookie)
    res.clearCookie('token');

    // Optionally, you can also clear any server-side sessions or state associated with the user
    // Example: You may want to remove any cached data or reset the user's session

    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


export { test, registerUser, loginUser, getProfile, logoutUser };
