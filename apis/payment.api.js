const router = require('express').Router()
const orderCtl = require('../controllers/order.controller')
const paymentCtl = require('../controllers/payment.controller')
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')

router.route('/create_payment_url').post(paymentCtl.create_payment_url)
// router
//     .route('/material/:id')
//     .get(materialCtl.getOne)
//     .delete(auth, authAdmin, materialCtl.delete)
//     .put(auth, authAdmin, materialCtl.update)
module.exports = router
