const Promotion = require('../models/promotion.model')
const voucher_codes = require('voucher-code-generator')
const _ = require('lodash')

const promotionCtl = {
    create: async (req, res, next) => {
        try {
            const { name, description, dateBegin, dateEnd, percent } = req.body
            if (!name || !description || !dateBegin || !dateEnd || !percent) {
                return res
                    .status(400)
                    .json({ msg: 'Please fill in all fields.' })
            }
            if (
                new Date(dateBegin) > new Date(dateEnd) ||
                new Date(dateEnd) < Date.now()
            ) {
                return res.status(400).json({ msg: 'Date invalid.' })
            }
            const code = voucher_codes.generate({
                length: 8,
            })[0]
            const promotion = await Promotion.findOne({ code: code })
            if (promotion) {
                return res.status(400).json({ msg: 'Code is already exists .' })
            }
            const newPromotion = new Promotion({
                name,
                description,
                dateBegin,
                dateEnd,
                code,
                percent,
            })
            await newPromotion.save()
            return res.status(201).json({ msg: 'Create success' })
        } catch (e) {
            return res.status(400).json({ msg: e.message })
        }
    },
    checkPromotion: async (req, res, next) => {
        try {
            const { code } = req.params
            const promotion = await Promotion.findOne({ code })
            if (!promotion) {
                return res.status(400).json({ msg: 'promotion is invalid' })
            }
            if (Date.now() > promotion.dateEnd) {
                return res.status(400).json({ msg: 'promotion is expired' })
            }
            if (Date.now() < promotion.dateBegin) {
                return res
                    .status(400)
                    .json({ msg: 'promotion is not yet applied' })
            }
            return res.status(200).json(promotion)
        } catch (e) {
            return res.status(400).json({ msg: e.message })
        }
    },
    getPromotion: async (req, res, next) => {
        try {
            const { id } = req.body
            const promotion = await Promotion.findOne({ _id: id })
            if (!promotion) {
                return res.status(400).json({ msg: 'promotion is invalid' })
            }
            return res.status(200).json(promotion)
        } catch (e) {
            return res.status(400).json({ msg: e.message })
        }
    },
    getAllPromotion: async (req, res, next) => {
        try {
            const promotions = await Promotion.find()
            return res.status(200).json(promotions)
        } catch (e) {
            return res.status(400).json({ msg: e.message })
        }
    },
    update: async (req, res, next) => {
        try {
            const { name, description, dateBegin, dateEnd, percent } = req.body
            const { id } = req.params
            const data = {
                name,
                description,
                dateBegin,
                dateEnd,
                percent,
            }
            const promotion = await Promotion.findOne({ _id: id })
            if (!promotion) {
                return res.status(400).json({ msg: 'promotion not found' })
            }
            for (let key in data) {
                if (!data[key]) delete data[key]
            }

            await Promotion.findOneAndUpdate({ _id: id }, data)
            return res.status(200).json({ msg: 'Update success' })
        } catch (e) {
            return res.status(400).json({ msg: e.message })
        }
    },
    delete: async (req, res, next) => {
        try {
            const { id } = req.params
            const promotion = Promotion.findOne({ _id: id })
            if (!promotion) {
                return res.status(404).json({ msg: 'promotion not found' })
            }
            await Promotion.updateOne({ _id: id }, { deletedAt: new Date() })

            return res.status(200).json({ msg: 'Deleted Success!' })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
}

module.exports = promotionCtl
