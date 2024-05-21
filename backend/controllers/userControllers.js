import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import generateTokenAndSetCookie from '../utils/helpers/generateTokenAndSetCookie.js';
import { mongoose } from 'mongoose';

const signupUser = async (req, res) => {
    try {
        const { name, email, username, password } = req.body;
        const user = await User.findOne({ $or: [{ email }, { username }] });

        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            name,
            email,
            username,
            password: hashedPassword,
        })
        await newUser.save();

        if (newUser) {

            generateTokenAndSetCookie(newUser._id, res);
            res.status(201).json({
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                username: newUser.username,
                bio: newUser.bio,
            })
        } else {
            res.status(400).json({ message: "Invalid user data" })
        }

    } catch (err) {
        res.status(500).json({ message: err.message })
        console.log("Error in signupUser: ", err.message)
    }
};

const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");

        if (!user || !isPasswordCorrect) return res.status(400).json({ message: "Invalid username or password" });

        generateTokenAndSetCookie(user._id, res)

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            username: user.username,
            bio: user.bio,
            profilePic: user.profilePic,
        })
    } catch (err) {
        res.status(500).json({ message: err.message })
        console.log("Error in loginUser: ", err.message)
    }
}

const logoutUser = async (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 1 });
        res.status(200).json({ message: "User logged out successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message })
        console.log("Error in logoutUser: ", err.message)
    }
}

const followUnFollowUser = async (req, res) => {
    try {
        const { id } = req.params;
        const userToModify = await User.findById(id);
        const currentUser = await User.findById(req.user._id);

        if (id === req.user._id.toString()) return res.status(400).json({ message: "You cannot follow/unfollow yourself" });

        if (!userToModify || !currentUser) return res.status(400).json({ message: "User not found" });

        const isFollowing = currentUser.following.includes(id);

        if (isFollowing) {
            //Unfollow
            await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
            await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
            res.status(200).json({ success: "User unfollowed successfully" })
        } else {
            //Follow
            await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });
            await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
            res.status(200).json({ success: "User followed successfully" })
        }

    } catch (err) {
        res.status(500).json({ message: err.message })
        console.log("Error in follow or unfollow user: ", err.message)
    }
}

const updateUser = async (req, res) => {
    const { name, email, username, password, bio } = req.body;
    const userId = req.user._id;
    let profilePic;

    try {
        let user = await User.findById(userId);
        if (!user) return res.status(400).json({ message: "User not found" });

        if (req.params.id !== userId.toString()) return res.status(400).json({ message: "You cannot update other user's profile" });

        if (password) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            user.password = hashedPassword;
        }
        if (!!req?.file) {
            profilePic = req.file.location;
        }

        user.name = name || user.name;
        user.email = email || user.email;
        user.username = username || user.username;
        user.profilePic = profilePic || user.profilePic;
        user.bio = bio || user.bio;

        user = await user.save();

        res.status(200).json({ success: "Profile uploaded successfully", user });
    } catch (err) {
        res.status(500).json({ message: err.message })
        console.log("Error in update user: ", err.message)
    }
}

const getUserProfile = async (req, res) => {
    const { query } = req.params;
    try {
        let user;

        if (mongoose.Types.ObjectId.isValid(query)) {
            user = await User.findOne({ _id: query }).select("-password").select("-updatedAt");
        } else {
            user = await User.findOne({ username: query }).select("-password").select("-updateAt");
        }

        if (!user) return res.status(400).json({ message: "User not found" });

        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: err.message })
        console.log("Error in get profile user: ", err.message)
    }
}

export {
    signupUser,
    loginUser,
    logoutUser,
    followUnFollowUser,
    updateUser,
    getUserProfile
};