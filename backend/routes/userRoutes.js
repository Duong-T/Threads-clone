import express from "express";
import {
    signupUser,
    loginUser,
    logoutUser,
    followUnFollowUser,
    updateUser,
    getUserProfile
} from "../controllers/userControllers.js";
import protectRoute from './../middlewares/protectRoute.js';
import uploadMiddleWare from './../middlewares/fileUpload.js';

const router = express.Router();

router.post("/signup", signupUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/follow/:id", protectRoute, followUnFollowUser);
router.put("/update/:id", protectRoute, uploadMiddleWare.single('file'), updateUser);
router.get("/profile/:query", getUserProfile);

export default router;