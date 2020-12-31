const router = require('express').Router()
const promotionCtl = require('../controllers/promotion.controller')
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')

router
    .route('/promotions')
    .get(auth, authAdmin, promotionCtl.getAllPromotion)
    .post(auth, authAdmin, promotionCtl.create)
router
    .route('/promotions/:id')
    .get(auth, authAdmin, promotionCtl.getPromotion)
    .delete(auth, authAdmin, promotionCtl.delete)
    .patch(auth, authAdmin, promotionCtl.update)

router.route('/promotions/check/:code').get(promotionCtl.checkPromotion)
module.exports = router
