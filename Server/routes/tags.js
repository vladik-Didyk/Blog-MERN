import express from "express";
import { TagsController } from "../controllers/index.js"; // Import PostController from controllers folder

const router = express.Router();


// Route to get the last tags
router.get("/", TagsController.getLastTags);


export default router;
