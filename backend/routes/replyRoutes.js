import express from "express";
import { anotherReply, createReply, deleteReply, getAllComment, getAllReply, getReply, likeUnlikeReply, replyPage } from "../controllers/replyControllers.js";
import protectRoute from './../middlewares/protectRoute.js';
import uploadMiddleWare from './../middlewares/fileUpload.js';

const router = express.Router();

router.post("/create", protectRoute, uploadMiddleWare.array('file', 10), createReply);
router.get("/:id", getReply);
router.delete("/:id", protectRoute, deleteReply);
router.get("/allreply/:id", protectRoute, getAllReply);
router.get("/allComment/:id", protectRoute, getAllComment);
router.put("/like/:id", protectRoute, likeUnlikeReply);
router.get("/replypage/:rId", replyPage);
router.get("/another/:rId", anotherReply);

export default router;