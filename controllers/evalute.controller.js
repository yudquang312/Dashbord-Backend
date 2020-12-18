const Evalute = require('../models/evalute.model')
const _ = require('lodash')
const evaluteCtl = {
    create: async (req, res, next) => {
        try {
            const { star, productId } = req.body
            // const productId = req.params

            if (!productId || !star) {
                return res.status(400).json({
                    msg: 'Please fill in all fields.',
                })
            }
            if (star > 5 || star < 0) {
                return res.status(400).json({
                    msg: 'Invalid, Please try again',
                })
            }
            const evalute = await Evalute.findOne({
                productId,
                userId: req.user.id,
            })

            if (evalute) {
                await Evalute.updateOne(
                    { productId, userId: req.user.id },
                    { star },
                )
            } else {
                const newEvalute = new Evalute({
                    star,
                    productId,
                    user: req.user.id,
                })

                await newEvalute.save()
            }
            return res.status(201).json({ msg: 'Evalute product success' })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    delete: async (req, res, next) => {
        try {
            const evalute = Evalute.findOne({
                _id: req.params.id,
                deletedAt: undefined,
            })

            if (!evalute) {
                return res.status(400).json({ msg: 'Evalute not found' })
            }

            await Evalute.updateOne(
                { _id: req.params.id, deletedAt: undefined },
                { deletedAt: new Date() },
            )
            return res.status(200).json({ msg: 'Deleted Success!' })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    // update: async (req, res, next) => {
    //     try {
    //         const { id, name, color } = req.body
    //         const data = { name, color }

    //         _.omitBy(data, _.isNull)
    //         await Color.findOneAndUpdate({ _id: id }, data)

    //         return res.status(200).json({ msg: 'Update Success!' })
    //     } catch (err) {
    //         return res.status(500).json({ msg: err.message })
    //     }
    // },
    getAllByAdmin: async (req, res, next) => {
        try {
            const evalutes = await Evalute.find({ deletedAt: undefined })

            return res.status(200).json(evalutes)
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    getAllByProduct: async (req, res, next) => {
        try {
            const evalutes = await Evalute.find({
                productId: req.params.id,
                deletedAt: undefined,
            })

            return res.status(200).json(evalutes)
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    getOne: async (req, res, next) => {
        try {
            const evalute = await Evalute.findOne({
                _id: req.params.id,
                deletedAt: undefined,
            })
            if (!evalute) {
                return res.status(400).json({ msg: 'Evalute not found' })
            }

            return res.status(200).json(evalute)
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
}

module.exports = evaluteCtl
