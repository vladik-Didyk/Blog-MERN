import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import net from "net";
import { validationResult } from "express-validator";
import { registerValidation } from "./validations/auth.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

/* ENVIRONMENT VARIABLES */
const MONGO_URL = process.env.MONGO_URL;

// Data imports
import UserModel from "./models/User.js";

/* CONFIGURATION */
const app = express();
const appPort = process.env.APP_PORT || 3000;

// Check if the port is already in use
function isPortInUse(port) {
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
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

/* Check if the port is available */
isPortInUse(appPort)
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
mongoose
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

app.use(express.json());

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

/* ROUTES */
app.get("/", (req, res) => {});

app.post("/auth/register", registerValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const doc = new UserModel({
      email: req.body.email,
      fullName: req.body.fullName,
      avatarUrl: req.body.avatarUrl,
      passwordHash,
    });

    const user = await doc.save();

    res.json(user);
  } catch (error) {
    console.log("🚀 ~ file: index.js:105 ~ app.post ~ error:", error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
});
