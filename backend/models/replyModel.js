import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema({
    type: { type: String, enum: ['image', 'video'], required: false },
    url: { type: String, required: true }
})
const replyForSchema = new mongoose.Schema({
    postId: mongoose.Schema.Types.ObjectId,
    replyId: mongoose.Schema.Types.ObjectId
})

const replySchema = mongoose.Schema({
    replyBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    replyFor: {
        type: replyForSchema,
    },
    text: {
        type: String,
        maxLength: 1000,
    },
    media: {
        type: [mediaSchema]
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

const Reply = mongoose.model('Reply', replySchema);

export default Reply;