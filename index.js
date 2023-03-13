import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import dotenv from "dotenv";
import net from "net";
import { validationResult } from "express-validator";
import { registerValidation } from "./validations/auth.js";

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

/* CONFIGURATION */
dotenv.config();

const MONGO_URL = process.env.MONGO_URL;

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

app.get("/", (req, res) => {});

app.post("/auth/register", registerValidation, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  res.json({
    success: true,
  });
});
