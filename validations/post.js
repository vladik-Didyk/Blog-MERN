import { body } from "express-validator";

export const postCreateValidation = [
  body("title", "Please enter a title.")
    .isLength({
      min: 3,
    })
    .isString(),
  body("text", "Please enter the content of your post.")
    .isLength({
      min: 3,
    })
    .isString(),
  body("tags", "Incorrect format for tags. Please use an array.")
    .optional()
    .isString(),
  body("imageUrl", "Incorrect URL for image.").optional().isString(),
];