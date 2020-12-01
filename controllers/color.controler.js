const Color = require('../models/color.model')
const _ = require('lodash')
const colorCtl = {
    create: async (req, res, next) => {
        try {
            const { name, code } = req.body
            if (!name || !code) {
                return res.status(400).json({
                    msg: 'Please fill in all fields.',
                })
            }
            const color = await Color.findOne({ code })

            if (color) {
                return res.status(400).json({
                    msg: 'This color code already exists .',
                })
            }
            const newColor = new Color({
                name,
                code,
            })
            await newColor.save()
            return res.status(201).json({ msg: 'Create color success' })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    delete: async (req, res, next) => {
        try {
            await Color.findByIdAndDelete(req.params.id)

            return res.status(200).json({ msg: 'Deleted Success!' })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    update: async (req, res, next) => {
        try {
            const { id, name, color } = req.body
            const data = { name, color }

            _.omitBy(data, _.isNull)
            await Color.findOneAndUpdate({ _id: id }, data)

            return res.status(200).json({ msg: 'Update Success!' })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    getAll: async (req, res, next) => {
        try {
            const colors = await Color.find()

            return res.status(200).json(colors)
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    getOne: async (req, res, next) => {
        try {
            const color = await Color.find(req.params.id)

            return res.status(200).json(color)
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
}

module.exports = colorCtl
