import express from "express";
import { postCreateValidation } from "../validations/post.js"; // Import postCreateValidation from validations folder
import { handleValidationErrors, checkAuth } from "../utils/index.js"; // Import middleware from utils folder
import { PostController } from "../controllers/index.js"; // Import PostController from controllers folder

const router = express.Router();

// Route to get all posts
router.get("/", PostController.getAll);

// Route to get the last tags
// router.get("/tags", PostController.getLastTags);

// Route to get a post by its ID
router.get("/:id", PostController.getOne);

// Route to create a new post
router.post(
  "/",
  checkAuth, // Middleware to check if the user is authenticated
  postCreateValidation, // Middleware to validate the post data
  handleValidationErrors, // Middleware to handle validation errors
  PostController.create // Controller function to create a new post
);

// Route to delete a post by its ID
router.delete("/:id", checkAuth, PostController.remove);

// Route to update a post by its ID
router.patch(
  "/:id",
  checkAuth, // Middleware to check if the user is authenticated
  postCreateValidation, // Middleware to validate the post data
  handleValidationErrors, // Middleware to handle validation errors
  PostController.update // Controller function to update a post
);

export default router;
