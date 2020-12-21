const router = require('express').Router()
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')
const orderCtl = require('../controllers/order.controller')
const productCtl = require('../controllers/product.controller')
router
    .route('/order')
    .get(auth, orderCtl.getAllOrderByUser)
    .post(auth, orderCtl.checkOrder, productCtl.decreaseAmount, orderCtl.create)

router.route('/order/:id').get(auth, orderCtl.getOrderByUser)
router.route('/admin/order').get(auth, authAdmin, orderCtl.getAllOrder)
router
    .route('/admin/order/:id')
    .get(auth, authAdmin, orderCtl.getOrder)
    .patch(auth, authAdmin, orderCtl.updateStatusByAdmin)
    .delete(auth, authAdmin, orderCtl.detele)

router
    .route('/admin/order/confirm/:id')
    .patch(auth, authAdmin, orderCtl.cancel_confirmOrderByAdmin)
router.route('/order/cancel/:id').patch(auth, orderCtl.cancelOrderByUser)

module.exports = router
