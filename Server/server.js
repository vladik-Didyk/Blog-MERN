import express from "express";
import multer from "multer";
import net from "net";
import dotenv from "dotenv";
import { connectDB } from "./utils/db.js";
import cors from "cors";

dotenv.config();

/* CONFIGURATION */
const app = express();
const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, "uploads");
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });
/* ENVIRONMENT VARIABLES */
const appPort = process.env.APP_PORT || 3000;

function start() {
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
}

/* Check if the port is available */
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

/* MONGOOSE SETUP */
connectDB();

app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

export { app, start };
