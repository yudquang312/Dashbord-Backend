const Order = require('../models/order.model')

const orderCtl = {
    create: async (req, res, next) => {
        try {
            const {
                
            }
        } catch (e) {
            return res.status(500).json({ msg: e.message })
        }
    },
}

module.exports = orderCtl
