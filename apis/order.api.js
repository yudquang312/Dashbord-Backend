const router = require('express').Router()
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')
const orderCtl = require('../controllers/order.controller')
const productCtl = require('../controllers/product.controller')
router
    .route('/orders')
    .get(auth, orderCtl.getAllOrderByUser)
    .post(auth, orderCtl.checkOrder, productCtl.decreaseAmount, orderCtl.create)

router.route('/orders/:id').get(auth, orderCtl.getOrderByUser)
router.route('/admin/orders').get(auth, authAdmin, orderCtl.getAllOrder)
router
    .route('/admin/orders/user/:id')
    .get(auth, authAdmin, orderCtl.getAllOrderUserByAdmin)
router
    .route('/admin/orders/:id')
    .get(auth, authAdmin, orderCtl.getOrder)
    .patch(auth, authAdmin, orderCtl.updateStatusByAdmin)
    .delete(auth, authAdmin, orderCtl.delete)

router
    .route('/admin/orders/confirm/:id')
    .patch(auth, authAdmin, orderCtl.cancel_confirmOrderByAdmin)
router.route('/orders/cancel/:id').patch(auth, orderCtl.cancelOrderByUser)

module.exports = router
