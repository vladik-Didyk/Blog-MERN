import express from "express"; // import the express framework
import mongoose from "mongoose"; // import mongoose for MongoDB connectivity
import net from "net"; // import net for checking if the port is available
import { registerValidation, loginValidation } from "./validations/auth.js"; // import registerValidation from validation folder
import checkAuth from "./utils/checkAuth.js"; // import checkAuth from utils folder

import {
  registerController,
  loginController,
  getUserController,
} from "./controllers/UserController.js";

import dotenv from "dotenv"; // import dotenv for environment variables
dotenv.config(); // load environment variables

/* ENVIRONMENT VARIABLES */
const MONGO_URL = process.env.MONGO_URL; // set MONGO_URL from environment variables

/* CONFIGURATION */
const app = express(); // create an instance of express
const appPort = process.env.APP_PORT || 3000; // set appPort

// Check if the port is already in use
function isPortInUse(port) {
  // create a function that returns a promise checking if the port is in use
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
function startServer(port) {
  // create a function to start the server
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

app.use((err, req, res, next) => {
  // error handling middleware
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

/* ROUTES */
app.get("/", (req, res) => {}); // define the root route

// Login route
app.post("/auth/login", loginValidation, loginController);

// Register route
app.post("/auth/register", registerValidation, registerController);

// Get data about me
app.get("/auth/me", checkAuth, getUserController);
