const router = require('express').Router()
const colorCtl = require('../controllers/color.controler')
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')

router.route('/colors').get(colorCtl.getAll).post(authAdmin, colorCtl.create)
router
    .route('/colors/:id')
    .get(colorCtl.getOne)
    .delete(authAdmin, colorCtl.delete)
    .put(authAdmin, colorCtl.update)
module.exports = router
