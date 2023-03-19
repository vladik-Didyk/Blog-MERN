import jwt from "jsonwebtoken"; // Import JWT library for token generation
import bcrypt from "bcrypt"; // Import bcrypt for password encryption

// Data imports
import UserModel from "../models/User.js"; // Import User model from the models folder

export const register = async (req, res) => {
  try {
    // Hash password
    const password = req.body.password; // Get the password from the request body
    const salt = await bcrypt.genSalt(10); // Generate a salt for hashing the password
    const passwordHashed = await bcrypt.hash(password, salt); // Hash the password using the generated salt

    // Save user to database
    const doc = new UserModel({
      // Create a new UserModel instance with the provided data
      email: req.body.email,
      fullName: req.body.fullName,
      avatarUrl: req.body.avatarUrl,
      passwordHash: passwordHashed,
    });
    const user = await doc.save(); // Save the new user to the database

    // Generate JWT token
    const token = jwt.sign(
      // Generate a JWT token for the registered user
      {
        _id: user._id, // Include the user's _id in the token payload
      },
      "secret123", // Secret key to sign the token
      {
        expiresIn: "30d", // Set token expiration to 30 days
      }
    );

    // Return user data and token without password hash
    const { passwordHash, ...userData } = user._doc; // Destructure passwordHash and userData from user document
    res.json({
      ...userData, // Return the user data
      token, // Return the generated JWT token
    });
  } catch (error) {
    // Handle errors
    console.log("🚀 ~ file: index.js:175 ~ app.post ~ error:", error);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

export const login = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email }); // Find the user with the provided email

    if (!user) {
      // If the user is not found, return an error message
      return res.status(400).json({
        message: "User not found",
      });
    }

    const isValidPassword = await bcrypt.compare(
      // Compare the provided password with the stored hash
      req.body.password,
      user._doc.passwordHash
    );

    if (!isValidPassword) {
      // If the password is not valid, return an error message
      return res.status(400).json({
        message: "Invalid user or password",
      });
    }

    // Describe action: Generate JWT token for user
    const token = jwt.sign(
      {
        _id: user._id,
      },
      "secret123",
      {
        expiresIn: "30d",
      }
    );

    // Describe action: Return user data and token without password hash
    const { passwordHash, ...userData } = user._doc;
    res.json({
      ...userData,
      token,
    });

    // Describe action: Catch and handle errors
  } catch (error) {
    console.log("🚀 ~ file: User.js:94 ~ login ~ error:", error);

    // Describe action: Send error response
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

// Describe action: Function to get user data
export const getUser = async (req, res) => {
  try {
    // Describe action: Find user by ID
    const user = await UserModel.findById(req.userId);
    console.log("🚀 ~ file: User.js:108 ~ getUser ~ user:", user);

    // Describe action: Check if user exists
    if (!user) {
      // Describe action: Send error response if user not found
      return res.status(400).json({
        message: "User not found",
      });
    }

    // Describe action: Return user data without password hash
    const { passwordHash, ...userData } = user._doc;
    res.json(userData);

    // Describe action: Catch and handle errors
  } catch (error) {
    console.log("🚀 ~ file: User.js:119 ~ getUser ~ error:", error);

    // Describe action: Send error response
    return res.status(500).json({
      message: "No access",
    });
  }
};
