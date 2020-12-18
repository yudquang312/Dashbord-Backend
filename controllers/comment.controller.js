const Comment = require('../models/comment.model')
const _ = require('lodash')
const commentCtl = {
    create: async (req, res, next) => {
        try {
            const { content, productId } = req.body
            // const productId = req.params

            if (!productId || !content) {
                return res.status(400).json({
                    msg: 'Please fill in all fields.',
                })
            }
            const newComment = new Comment({
                productId,
                user: req.user.id,
                content,
                reply: [],
            })

            await newComment.save()
            return res.status(201).json({ msg: 'Comment product success' })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    delete: async (req, res, next) => {
        try {
            const comment = Comment.findOne({
                _id: req.params.id,
                deletedAt: undefined,
            })

            if (!comment) {
                return res.status(400).json({ msg: 'Comment not found' })
            }

            await Comment.updateOne(
                { _id: req.params.id, deletedAt: undefined },
                { deletedAt: new Date() },
            )
            return res.status(200).json({ msg: 'Deleted Success!' })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },

    confirmComment: async (req, res, next) => {
        try {
            const comment = Comment.findOne({
                _id: req.params.id,
                deletedAt: undefined,
                confirm: false,
            })

            if (!comment) {
                return res.status(400).json({ msg: 'Comment not found' })
            }
            await Comment.updateOne(
                { _id: req.params.id, deletedAt: undefined, confirm: false },
                { confirm: true },
            )
            return res.status(200).json({ msg: 'Confirm success' })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    getAllByAdmin: async (req, res, next) => {
        try {
            const comments = await Comment.find({ deletedAt: undefined })

            return res.status(200).json(comments)
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    getAllByProduct: async (req, res, next) => {
        try {
            const comments = await Comment.find({
                productId: req.params.id,
                deletedAt: undefined,
                // confirm: true,
            })
                .populate({
                    path: 'userId',
                    selecte: 'name',
                })
                .sort({ createdAt: -1 })

            return res.status(200).json(comments)
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    getOne: async (req, res, next) => {
        try {
            const comment = await Comment.findOne({
                _id: req.params.id,
                deletedAt: undefined,
                confirm: true,
            })
            if (!comment) {
                return res.status(400).json({ msg: 'Comment not found' })
            }

            return res.status(200).json(comment)
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
}

module.exports = commentCtl
