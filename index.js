
import { app, start } from "./server.js";
import authRoutes from "./routes/auth.js";
import postRoutes from "./routes/posts.js";


/* ROUTES */
app.use("/auth", authRoutes);
app.use("/posts", postRoutes);

start();
