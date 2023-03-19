import { validationResult } from "express-validator";

// Define the middleware function with three parameters: req, res, and next
export default (req, res, next) => {
  // Call the validationResult function to get the result of validating the request data
  const errors = validationResult(req);

  // If there are validation errors, send a 400 Bad Request response with the error messages
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Call the next middleware function in the chain
  next();
};
