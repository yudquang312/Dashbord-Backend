const Category = require('../models/category.model')
const _ = require('lodash')
const categoryCtl = {
    create: async (req, res, next) => {
        try {
            const { name } = req.body
            if (!name) {
                return res.status(400).json({
                    msg: 'Please fill in all fields.',
                })
            }
            const category = await Category.findOne({ name })

            if (category) {
                return res.status(400).json({
                    msg: 'This material already exists .',
                })
            }
            const newCategory = new Category({
                name,
            })
            await newCategory.save()
            return res.status(201).json({ msg: 'Create category success' })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    delete: async (req, res, next) => {
        try {
            await Category.findByIdAndDelete(req.params.id)

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
            await Category.findOneAndUpdate({ _id: id }, data)

            return res.status(200).json({ msg: 'Update Success!' })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    getAll: async (req, res, next) => {
        try {
            const categories = await Category.find()

            return res.status(200).json(categories)
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    getOne: async (req, res, next) => {
        try {
            const category = await Category.find(req.params.id)

            return res.status(200).json(category)
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
}

module.exports = categoryCtl
