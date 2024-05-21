import express from "express"
import { getConversations, getMessages, sendMessage } from "../controllers/messageControllers.js";
import protectRoute from './../middlewares/protectRoute.js';

const router = express.Router();

router.get("/conversations", protectRoute, getConversations);
router.post("/", protectRoute, sendMessage);
router.get("/:otherUserId", protectRoute, getMessages);


export default router;