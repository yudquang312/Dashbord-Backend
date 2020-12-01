const Style = require('../models/style.model')
const _ = require('lodash')

const styleCtl = {
    create: async (req, res, next) => {
        try {
            const { name } = req.body
            if (!name) {
                return res.status(400).json({
                    msg: 'Please fill in all fields.',
                })
            }
            const style = await Style.findOne({ name })

            if (style) {
                return res.status(400).json({
                    msg: 'This style already exists .',
                })
            }
            const newStyle = new Style({
                name,
            })
            await newStyle.save()
            return res.status(201).json({ msg: 'Create style success' })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    delete: async (req, res, next) => {
        try {
            await Style.findByIdAndDelete(req.params.id)

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
            await Style.findOneAndUpdate({ _id: id }, data)

            return res.status(200).json({ msg: 'Update Success!' })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    getAll: async (req, res, next) => {
        try {
            const styles = await Style.find()

            return res.status(200).json(styles)
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    getOne: async (req, res, next) => {
        try {
            const style = await Style.find(req.params.id)

            return res.status(200).json(style)
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
}

module.exports = styleCtl
