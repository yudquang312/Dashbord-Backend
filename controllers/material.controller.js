const Material = require('../models/material.model')
const _ = require('lodash')
const materialCtl = {
    create: async (req, res, next) => {
        try {
            const { name } = req.body
            if (!name) {
                return res.status(400).json({
                    msg: 'Please fill in all fields.',
                })
            }
            const material = await Material.findOne({ name })

            if (material) {
                return res.status(400).json({
                    msg: 'This material already exists .',
                })
            }
            const newMaterial = new Material({
                name,
            })
            await newMaterial.save()
            return res.status(201).json({ msg: 'Create Material success' })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    delete: async (req, res, next) => {
        try {
            await Material.findByIdAndDelete(req.params.id)

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
            await Material.findOneAndUpdate({ _id: id }, data)

            return res.status(200).json({ msg: 'Update Success!' })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    getAll: async (req, res, next) => {
        try {
            const materials = await Material.find()

            return res.status(200).json(materials)
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    getOne: async (req, res, next) => {
        try {
            const material = await Material.find(req.params.id)

            return res.status(200).json(material)
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
}

module.exports = materialCtl
