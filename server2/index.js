
import { app, start } from "./server.js";
import express from "express";
import authRoutes from "./routes/auth.js";
import postRoutes from "./routes/posts.js";
import tagsRoutes from "./routes/tags.js";
import uploadRoutes from "./routes/upload.js";


/* ROUTES */
app.use("/auth", authRoutes);
app.use("/posts", postRoutes);
app.use("/tags", tagsRoutes);

app.use("/uploads", express.static("uploads"));
app.use("/uploads", uploadRoutes); 

start();
