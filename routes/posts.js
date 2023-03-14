// routes/post.js

import express from "express";
import { postCreateValidation } from "../validations/post.js"; // import registerValidation from validation folder
import { handleValidationErrors, checkAuth } from "../utils/index.js";
import { PostController } from "../controllers/index.js"; // import UserController from controllers folder

const router = express.Router();

router.get("/", PostController.getAll);
router.get("/:id", PostController.getOne);
router.post(
  "/",
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  PostController.create
);
router.delete("/:id", checkAuth, PostController.remove);
router.patch(
  "/:id",
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  PostController.update
);

export default router;
