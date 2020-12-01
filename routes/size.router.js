const router = require('express').Router()
const sizeCtl = require('../controllers/size.controler')
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')

router.route('/sizes').get(sizeCtl.getAll).post(authAdmin, sizeCtl.create)
router
    .route('/sizes/:id')
    .get(sizeCtl.getOne)
    .delete(authAdmin, sizeCtl.delete)
    .put(authAdmin, sizeCtl.update)
module.exports = router
