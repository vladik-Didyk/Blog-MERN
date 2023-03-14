// routes/auth.js

import express from "express";
import { registerValidation, loginValidation } from "../validations/auth.js"; // import registerValidation from validation folder
import { handleValidationErrors, checkAuth } from "../utils/index.js";
import { UserController } from "../controllers/index.js"; // import UserController from controllers folder

const router = express.Router();

// Login route
router.post(
  "/login",
  loginValidation,
  handleValidationErrors,
  UserController.login
);

// Register route
router.post(
  "/register",
  registerValidation,
  handleValidationErrors,
  UserController.register
);

// Get data about me
router.get("/me", checkAuth, UserController.getUser);

export default router;
