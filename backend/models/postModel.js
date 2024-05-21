import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema({
    type: { type: String, enum: ['image', 'video'], required: false },
    url: { type: String, required: true }
})

const postSchema = mongoose.Schema({
    postBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text: {
        type: String,
        maxLength: 1000,
    },
    media: {
        type: [mediaSchema],
    },
    likes: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User',
        default: []
    },
    replies: {
        type: [mongoose.Schema.Types.ObjectId],
        default: []
    }
}, {
    timestamps: true,
});

const Post = mongoose.model('Post', postSchema);

export default Post;