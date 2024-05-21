import Post from "../models/postModel.js";
import User from './../models/userModel.js';
import Reply from './../models/replyModel.js';

const createPost = async (req, res) => {
    try {
        const { postBy, text } = req.body
        if (!postBy) return res.status(400).json({ message: "PostBy is required" });
        const files = req.files
        const media = files.map((val, i) => {
            return {
                type: val.mimetype.includes("video") ? "video" : "image",
                url: val.location
            }
        })
        if (!text && !files) return res.status(400).json({ message: "need to add content" });

        const user = await User.findById(postBy);
        if (!user) return res.status(400).json({ message: "user not found" });

        if (user._id.toString() != req.user._id.toString()) {
            return res.status(401).json({ message: "Unauthorized to create post" });
        }
        const maxlength = 1000;
        if (text.length > maxlength) {
            return res.status(400).json({ message: `text must be at less than ${maxlength} characters` });
        }

        const newPost = new Post({ postBy, text, media: media });

        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log("Error in create post:", error.message);
    }
}

const getPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) return res.status(404).json({ message: "post not found" });

        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log("Error in get post:", error.message);
    }
}

const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) return res.status(400).json({ message: "post not found" });

        if (post.postBy.toString() != req.user._id.toString()) {
            return res.status(401).json({ message: "Unauthorized to delete post" });
        }

        await Post.findByIdAndDelete(req.params.id);
        await Reply.deleteMany({ _id: { $in: post.replies } })

        res.status(200).json({ success: "Posts deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log("Error in delete post:", error.message);
    }
}

const likeUnlike = async (req, res) => {
    try {
        const { id: postId } = req.params;
        const post = await Post.findById(postId);
        const currentUser = req.user._id;

        if (!post) return res.status(400).json({ message: "post not found" });

        const userLikedPost = post.likes.includes(currentUser);

        if (userLikedPost) {
            //Unlike
            await Post.updateOne({ _id: postId }, { $pull: { likes: currentUser } });
            res.status(200).json({ success: "User unlike successfully" });
        } else {
            post.likes.push(currentUser);
            await post.save();
            res.status(200).json({ success: "Post liked successfully" });
        }

    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log("Error in like unlike post:", error.message);
    }
}

const getFeedPosts = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        const following = user.following;

        const feedPosts = await Post.find({ postBy: { $in: following } }).sort({ createdAt: -1 });

        res.status(200).json(feedPosts);

    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log("Error in get feed:", error.message);
    }
}

const getUserPosts = async (req, res) => {
    const { username } = req.params;
    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(404).json({ message: "User not found" });

        const posts = await Post.find({ postBy: user._id }).sort({ createdAt: -1 });

        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export {
    createPost,
    getPost,
    deletePost,
    likeUnlike,
    getFeedPosts,
    getUserPosts
};