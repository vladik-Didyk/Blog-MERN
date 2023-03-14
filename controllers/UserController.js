import jwt from "jsonwebtoken"; // import jwt library for token generation
import bcrypt from "bcrypt"; // import bcrypt for password encryption
import { validationResult } from "express-validator"; // import validationResult from express-validator

// Data imports
import UserModel from "../models/User.js"; // import User model from models folder

export const register = async (req, res) => {
  try {
    // Validate request data
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Hash password
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const passwordHashed = await bcrypt.hash(password, salt);

    // Save user to database
    const doc = new UserModel({
      email: req.body.email,
      fullName: req.body.fullName,
      avatarUrl: req.body.avatarUrl,
      passwordHash: passwordHashed,
    });
    const user = await doc.save();

    // Generate JWT token
    const token = jwt.sign(
      {
        _id: user._id,
      },
      "secret123",
      {
        expiresIn: "30d",
      }
    );

    // Return user data and token without password hash
    const { passwordHash, ...userData } = user._doc;
    res.json({
      ...userData,
      token,
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
    const user = await UserModel.findOne({ email: req.body.email });

    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    const isValidPassword = await bcrypt.compare(
      req.body.password,
      user._doc.passwordHash
    );

    if (!isValidPassword) {
      return res.status(400).json({
        message: "Invalid user or password",
      });
    }

    // generate token
    const token = jwt.sign(
      {
        _id: user._id,
      },
      "secret123",
      {
        expiresIn: "30d",
      }
    );
    // Return user data and token without password hash
    const { passwordHash, ...userData } = user._doc;
    res.json({
      ...userData,
      token,
    });
  } catch (error) {
    console.log("🚀 ~ file: User.js:94 ~ login ~ error:", error);
    // Handle errors
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);
    console.log("🚀 ~ file: User.js:108 ~ getUser ~ user:", user);
    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    const { passwordHash, ...userData } = user._doc;
    res.json(userData);
  } catch (error) {
    console.log("🚀 ~ file: User.js:119 ~ getUser ~ error:", error);
    // Handle errors
    return res.status(500).json({
      message: "No access",
    });
  }
};
