
import { app, start } from "./server.js";
import authRoutes from "./routes/auth.js";
import postRoutes from "./routes/posts.js";
import tagsRoutes from "./routes/tags.js";


/* ROUTES */
app.use("/auth", authRoutes);
app.use("/posts", postRoutes);
app.use("/tags", tagsRoutes);

start();
