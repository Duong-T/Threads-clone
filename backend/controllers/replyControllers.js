import User from './../models/userModel.js';
import Post from '../models/postModel.js';
import Reply from './../models/replyModel.js';

const createReply = async (req, res) => {
    try {
        const { text, replyBy, postId, replyId } = req.body;
        const files = req.files
        let media;
        let replyFor;
        if (files) {
            media = files.map((val) => {
                return {
                    type: val.mimetype.includes("video") ? "video" : "image",
                    url: val.location,
                }
            })
        }
        if (!replyBy) return res.status(400).json({ message: "replyBy is requied" });
        if (!text && !files) return res.status(400).json({ message: "need to add content" });
        const user = await User.findById(replyBy);

        if (!user) return res.status(400).json({ message: "User not found" });
        if (user._id.toString() != req.user._id.toString()) {
            return res.status(401).json({ message: "Unauthorized to create reply" });
        }

        const maxlength = 1000;
        if (text.length > maxlength) {
            return res.status(400).json({ message: `text must be at less than ${maxlength} characters` });
        }
        if (postId) {
            replyFor = { postId: postId }
        } else if (replyId) {
            replyFor = { replyId: replyId }
        }
        const newReply = new Reply({ replyBy, text, media: media, replyFor: replyFor });
        await newReply.save();
        res.status(200).json(newReply)
        if (!postId && !replyId) return res.status(400).json({ message: "Can't reply none" })
        if (postId) {
            const post = await Post.findById(postId);
            post.replies.push(newReply._id);
            await post.save();
        }
        if (replyId) {
            const reply = await Reply.findById(replyId)
            reply.replies.push(newReply._id);
            await reply.save();
        }

    } catch (error) {
        res.status(500).json({ message: error.message })
    }

}

const likeUnlikeReply = async (req, res) => {
    try {
        const { id: replyId } = req.params;
        const reply = await Reply.findById(replyId);
        const currentUser = req.user._id;

        if (!reply) return res.status(400).json({ message: "reply not found" });

        const userLikedReply = reply.likes.includes(currentUser);

        if (userLikedReply) {
            //Unlike
            await Reply.updateOne({ _id: replyId }, { $pull: { likes: currentUser } });
            res.status(200).json({ success: "User unlike successfully" });
        } else {
            reply.likes.push(currentUser);
            await reply.save();
            res.status(200).json({ success: "Reply liked successfully" });
        }

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const deleteReply = async (req, res) => {
    try {
        const reply = await Reply.findById(req.params.id);
        const allReply = [];
        if (!reply) return res.status(400).json({ message: "reply not found" });

        if (reply.replyBy.toString() != req.user._id.toString()) {
            return res.status(401).json({ message: "Unauthorized to delete post" });
        }
        if (reply.replies === 0) {
            await Reply.findByIdAndDelete(req.params.id);
        } else if (reply.replies > 0) {
            await reply.replies.forEach(reply => {
                recursiveAllRely(reply)
            })
        }

        const recursiveAllRely = async (replyId) => {
            const replyChild = await Reply.findById(replyId);
            if (replyChild.replies === 0) {
                return (
                    allReply.push(replyId)
                )
            }
            if (replyChild.replies > 0) {
                return (
                    allReply.push(replyId),
                    await replyChild.replies.forEach(reply => {
                        recursiveAllRely(reply)
                    })
                )
            }
        }

        if (reply.replyFor.postId) {
            await Post.updateOne({ _id: reply.replyFor.postId }, { $pull: { replies: reply._id } })
        }
        if (reply.replyFor.replyId) {
            await Reply.updateOne({ _id: reply.replyFor.replyId }, { $pull: { replies: reply._id } })
        }
        if (reply.replies.length > 0) {
            await Reply.deleteMany({ _id: { $in: reply.replies } })
        }

        res.status(200).json({ success: "Reply deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getReply = async (req, res) => {
    try {
        const reply = await Reply.findById(req.params.id);

        if (!reply) return res.status(404).json({ message: "post not found" });

        res.status(200).json(reply);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getAllReply = async (req, res) => {
    try {
        const { id: postId } = req.params;
        const post = await Post.findById(postId);
        if (!post) return res.status(400).json({ message: "Post not found" });

        const replies = post.replies;
        const replys = await Reply.find({ _id: { $in: replies } }).sort({ createdAt: -1 });
        res.status(200).json(replys);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getAllComment = async (req, res) => {
    try {
        const { id: replyId } = req.params;
        if (replyId) {
            const reply = await Reply.findById(replyId);
            if (!reply) return res.status(400), json({ message: "Reply not found" });
            const replyComment = await Reply.find({ _id: { $in: reply.replies } }).sort({ createdAt: -1 });
            res.status(200).json(replyComment);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const replyPage = async (req, res) => {
    try {
        const { rId: replyId } = req.params;
        const allReply = [];
        const post = [];
        const recursiveReply = async (replyId) => {
            const reply = await Reply.findById(replyId);
            if (reply.replyFor.postId) {
                const getPost = await Post.findById(reply.replyFor.postId)
                return (
                    allReply.push(reply),
                    post.push(getPost)
                )
            }

            return (
                allReply.push(reply),
                await recursiveReply(reply.replyFor.replyId)
            )
        }
        await recursiveReply(replyId);
        const allReplys = await allReply.reverse();
        res.status(200).json({ allReplys, post });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const anotherReply = async (req, res) => {
    try {
        const { rId: replyId } = req.params;
        const reply = await Reply.findById(replyId);
        if (reply.replyFor.replyId) {
            const replyFor = await Reply.findById(reply.replyFor.replyId);
            if (replyFor.replies.length === 1 || replyFor.replies.length === 0) {
                res.status(200).json({ success: "no another reply" });
            }
            if (replyFor.replies.length > 1) {
                const subId = [];
                for (let i = 0; i < replyFor.replies.length; i++) {
                    if (replyFor.replies[i].toString().replace(/ObjectId\("(.*)"\)/, "$1") !== replyId) {
                        subId.push(replyFor.replies[i])
                    }
                }
                const allReply = await Reply.find({ _id: { $in: subId } })
                res.status(200).json(allReply)
            }
        }
        if (reply.replyFor.postId) {
            const postFor = await Post.findById(reply.replyFor.postId)
            if (postFor.replies.length === 1 || postFor.replies.length === 0) {
                res.status(200).json({ success: "no another reply" });
            }
            if (postFor.replies.length > 1) {
                const subId = [];
                for (let i = 0; i < postFor.replies.length; i++) {
                    if (postFor.replies[i].toString().replace(/ObjectId\("(.*)"\)/, "$1") !== replyId) {
                        subId.push(postFor.replies[i])
                    }
                }
                const allReply = await Reply.find({ _id: { $in: subId } })
                res.status(200).json(allReply)
            }
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export {
    createReply,
    likeUnlikeReply,
    deleteReply,
    getReply,
    getAllReply,
    getAllComment,
    replyPage,
    anotherReply
}