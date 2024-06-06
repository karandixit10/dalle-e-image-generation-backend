import UserSchema from "../mongodb/models/user.js";
import { hashPassword, comparePasswords } from "../helpers/auth.js";

// controllers/authController.js
const test = (req, res) => {
    res.json({ message: 'Hello for Authentication!' });
}


//Register EndPoint
const registerUser = async (req, res) => {
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

//Login Endpoint
const loginUser = async (req, res) => {
    try {
        const {email, password} = req.body;

        //Check if user exists
        const user = await UserSchema.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User does not exist' });
        }

        //Compare Passwords
        const isMatch = await comparePasswords(password, user.password);
        if(isMatch){
            return res.status(200).json({message: 'Passwords match'});
        }else{
            return res.status(400).json({message: 'Passwords do not match'});
        }
    } catch (error) {
        console.log(error);
    }
}


export { test, registerUser, loginUser };
