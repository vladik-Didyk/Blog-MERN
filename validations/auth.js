import { body } from "express-validator";

export const registerValidation = [
    body("email", "Email is not in the correct format.").isEmail(),
    body("password", "Password must be at least 5 characters long.").isLength({ min: 5 }),
    body("fullName", "Please add your name.").isLength({ min: 3 }),
    body("avatarUrl", "The URL is not correct.").optional().isURL(),
    ];