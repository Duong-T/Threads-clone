import express from "express";
import { createPost, deletePost, getFeedPosts, getPost, getUserPosts, likeUnlike } from "../controllers/postControllers.js";
import protectRoute from './../middlewares/protectRoute.js';
import uploadMiddleWare from './../middlewares/fileUpload.js';

const router = express.Router();

router.get("/feed", protectRoute, getFeedPosts);
router.post("/create", protectRoute, uploadMiddleWare.array('file', 10), createPost);
router.get("/:id", getPost);
router.delete("/:id", protectRoute, deletePost);
router.put("/like/:id", protectRoute, likeUnlike);
router.get("/user/:username", getUserPosts);

export default router;