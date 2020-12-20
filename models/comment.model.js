const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, 'User is require'],
            ref: 'User',
        },
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, 'Product is require'],
            ref: 'Product',
        },
        content: {
            type: String,
            required: [true, 'Content is require'],
        },
        // comfirm: {
        //     type: Boolean,
        //     default: false,
        // },
        like: {
            type: Array,
        },
        reply: {
            type: Array,
            default: [],
        },
        deletedAt: {
            type: Date,
        },
    },
    { timestamps: true },
)

module.exports = mongoose.model('Comment', commentSchema, 'comments')