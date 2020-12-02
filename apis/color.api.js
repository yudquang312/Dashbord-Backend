const router = require('express').Router()
const colorCtl = require('../controllers/color.controler')
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')

router
    .route('/colors')
    .get(colorCtl.getAll)
    .post(auth, authAdmin, colorCtl.create)
router
    .route('/colors/:id')
    .get(colorCtl.getOne)
    .delete(auth, authAdmin, colorCtl.delete)
    .put(auth, authAdmin, colorCtl.update)

module.exports = router
