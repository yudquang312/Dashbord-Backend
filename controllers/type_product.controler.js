const TypeProduct = require('../models/type_product.model')
const _ = require('lodash')
const typeProductCtl = {
    create: async (req, res, next) => {
        try {
            const { name } = req.body
            if (!name) {
                return res.status(400).json({
                    msg: 'Please fill in all fields.',
                })
            }
            const typeProduct = await TypeProduct.findOne({ name })

            if (typeProduct) {
                return res.status(400).json({
                    msg: 'This type product already exists .',
                })
            }
            const newTypeProduct = new TypeProduct({
                name,
                code,
            })
            await newTypeProduct.save()
            return res.status(201).json({ msg: 'Create type product success' })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    delete: async (req, res, next) => {
        try {
            await TypeProduct.findByIdAndDelete(req.params.id)

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
            await TypeProduct.findOneAndUpdate({ _id: id }, data)

            return res.status(200).json({ msg: 'Update Success!' })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    getAll: async (req, res, next) => {
        try {
            const typeProducts = await TypeProduct.find()

            return res.status(200).json(typeProducts)
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    getOne: async (req, res, next) => {
        try {
            const typeProduct = await TypeProduct.find(req.params.id)

            return res.status(200).json(typeProduct)
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
}

module.exports = typeProductCtl
