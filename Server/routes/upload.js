// Import the Express module to create a router object
import express from "express";
// Import the Multer module for handling file uploads
import multer from "multer";
// Import the 'uploadImage' controller function from the UploadController module
import { uploadImage } from "../controllers/UploadController.js";

// Create a new router object
const router = express.Router();

// Configure the Multer storage options to store uploaded files in the 'uploads' directory
// and use the original filename for the stored file
const storage = multer.diskStorage({
  // Set the destination folder for uploaded files
  destination: (_, __, cb) => {
    cb(null, "uploads");
  },
  // Set the filename for uploaded files
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

// Create a Multer middleware instance using the storage configuration
const upload = multer({ storage });

// Define a route to handle file uploads:
// - POST requests to '/'
// - Use the 'upload.single("image")' middleware to handle a single file with the field name 'image'
// - Call the 'uploadImage' controller function after the file is uploaded
router.post("/", upload.single("image"), uploadImage);

// Export the router object to be used as middleware in the main server file
export default router;
