import express from "express";
import dotenv from "dotenv";
import connectDB from './db/connectDB.js';
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import replyRoutes from "./routes/replyRoutes.js";
import messageRoutes from "./routes/messageRoutes.js"
import { app, server } from "./socket/socket.js"

dotenv.config();

connectDB();

const PORT = process.env.PORT || 8100;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Routes
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/reply", replyRoutes);
app.use("/api/messages", messageRoutes);

server.listen(PORT, () => console.log(`Server started at http://localhost:${PORT}`));