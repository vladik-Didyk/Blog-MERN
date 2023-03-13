import express from "express"; // import the express framework
import jwt from "jsonwebtoken"; // import jwt library for token generation
import mongoose from "mongoose"; // import mongoose for MongoDB connectivity
import net from "net"; // import net for checking if the port is available
import { validationResult } from "express-validator"; // import validationResult from express-validator
import { registerValidation } from "./validations/auth.js"; // import registerValidation from validation folder
import bcrypt from "bcrypt"; // import bcrypt for password encryption
import dotenv from "dotenv"; // import dotenv for environment variables
dotenv.config(); // load environment variables

/* ENVIRONMENT VARIABLES */
const MONGO_URL = process.env.MONGO_URL; // set MONGO_URL from environment variables

// Data imports
import UserModel from "./models/User.js"; // import User model from models folder

/* CONFIGURATION */
const app = express(); // create an instance of express
const appPort = process.env.APP_PORT || 3000; // set appPort

// Check if the port is already in use
function isPortInUse(port) { // create a function that returns a promise checking if the port is in use
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.once("error", (err) => {
      if (err.code !== "EADDRINUSE") {
        return reject(err);
      }
      resolve(true);
    });
    server.once("listening", () => {
      server.close();
      resolve(false);
    });
    server.listen(port);
  });
}

/* Start the server on the given port */
function startServer(port) { // create a function to start the server
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

/* Check if the port is available */
isPortInUse(appPort) // check if the port is in use
  .then((inUse) => {
    if (inUse) {
      console.log(`Port ${appPort} is busy, retrying...`);
      appPort++;
      startServer(appPort);
    } else {
      startServer(appPort);
    }
  })
  .catch((err) => {
    console.error(`Error checking if port ${appPort} is in use: ${err}`);
  });

/* MONGOOSE SETUP */
mongoose // connect to the MongoDB database
  .connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to db");
  })
  .catch((err) => {
    console.log("err ->", err);
  });

app.use(express.json()); // use JSON for the request and response

app.use((err, req, res, next) => { // error handling middleware
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

/* ROUTES */
app.get("/", (req, res) => {}); // define the root route


app.post("/auth/register", registerValidation, async (req, res) => {
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
      console.log("🚀 ~ file: index.js:105 ~ app.post ~ error:", error);
      res.status(500).json({
        message: "Something went wrong",
      });
    }
  });