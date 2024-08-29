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
export const getAllUsers = (req, res) => {
	const {token} = req.cookies
	if(token){
		jwt.verify(token, process.env.JWT_SECRET, {}, (err, user) => {
			if(err){
				throw err;
			}
			res.status(200).json(user);
		})
	}
	else{
		res.status(401).json({message: 'Unauthorized'})
	}
};

// Register function
export const registerUser = async (req, res) => {
  try {
      const { name, email, password } = req.body;

      // Validation for name
      if (!name) {
          return res.status(400).json({ message: 'Name is required' });
      }

      // Validation for password
      if (!password || password.length < 6) {
          return res.status(400).json({ message: 'Password must be at least 6 characters' });
      }   

      // Check if the email already exists
      const exist = await UserSchema.findOne({ email });
      if (exist) {
          return res.status(400).json({ message: 'Email already exists' });
      }   

      //Encrpt Password
      const hashedPassword = await hashPassword(password);

      // Create new user
      const user = await UserSchema.create({ name, email, password : hashedPassword });

      return res.status(201).json(user); // Return status 201 for successful creation
  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' }); // Return status 500 for internal server error
  }
}

export const logoutUser = (req, res) => {
  // Clear token from client's cookies or session storage
  res.clearCookie('token'); // Example for clearing cookie

  // Respond with success message
  return res.status(200).json({ msg: "Logged out successfully" });
}