import express from "express";
import { registerValidation, loginValidation } from "../validations/auth.js"; // Import registerValidation and loginValidation from validations folder
import { handleValidationErrors, checkAuth } from "../utils/index.js"; // Import middleware from utils folder
import { UserController } from "../controllers/index.js"; // Import UserController from controllers folder

const router = express.Router();

// Route to log in a user
router.post(
  "/login",
  loginValidation, // Middleware to validate the login data
  handleValidationErrors, // Middleware to handle validation errors
  UserController.login // Controller function to log in a user
);

// Route to register a new user
router.post(
  "/register",
  registerValidation, // Middleware to validate the registration data
  handleValidationErrors, // Middleware to handle validation errors
  UserController.register // Controller function to register a new user
);

// Route to get data about the currently authenticated user
router.get(
  "/me",
  checkAuth, // Middleware to check if the user is authenticated
  UserController.getUser // Controller function to get the authenticated user's data
);

export default router;
