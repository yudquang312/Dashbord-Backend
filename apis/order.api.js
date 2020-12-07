const router = require('express').Router()
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')
const orderCtl = require('../controllers/order.controller')

router
    .route('/order')
    .get(auth, orderCtl.getOrderByUser)
    .post(auth, orderCtl.create)

router.route('/order/:id').get(auth, orderCtl.getOrderByUser)

router.route('/admin/order').get(auth, authAdmin, orderCtl.getAllOrder)
router
    .route('/admin/order/:id')
    .get(auth, authAdmin, orderCtl.getOrder)
    .patch(auth, authAdmin, orderCtl.update)
    .delete(auth, authAdmin, orderCtl.detele)

module.exports = router
