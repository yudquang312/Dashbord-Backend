const Size = require('../models/size.model')
const _ = require('lodash')
const sizeCtl = {
    create: async (req, res, next) => {
        try {
            const { name } = req.body
            if (!name) {
                return res.status(400).json({
                    msg: 'Please fill in all fields.',
                })
            }
            const size = await Size.findOne({ name })

            if (size) {
                return res.status(400).json({
                    msg: 'This size already exists .',
                })
            }
            const newSize = new Size({
                name,
                code,
            })
            await newSize.save()
            return res.status(201).json({ msg: 'Create Size success' })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    delete: async (req, res, next) => {
        try {
            await Size.findByIdAndDelete(req.params.id)

            return res.status(200).json({ msg: 'Deleted Success!' })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    update: async (req, res, next) => {
        try {
            const { id, name } = req.body
            if (!name) {
                return res.status(400).json({
                    msg: 'Please fill in all fields.',
                })
            }
            const data = { name }

            _.omitBy(data, _.isNull)
            await Size.findOneAndUpdate({ _id: id }, data)

            return res.status(200).json({ msg: 'Update Success!' })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    getAll: async (req, res, next) => {
        try {
            const sizes = await Size.find()

            return res.status(200).json(sizes)
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    getOne: async (req, res, next) => {
        try {
            const size = await Size.find(req.params.id)

            return res.status(200).json(size)
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
}

module.exports = sizeCtl
