const router = require('express').Router()
const commentCtl = require('../controllers/comment.controller')
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')

router
    .route('/comment')
    .post(auth, commentCtl.create)
    .get(auth, authAdmin, commentCtl.getAllByAdmin)

router.route('/product/:id/comment').get(commentCtl.getAllByProduct)
router
    .route('/comment/:id')
    .get(auth, commentCtl.getOne)
    .delete(auth, authAdmin, commentCtl.delete)
    .patch(auth, authAdmin, commentCtl.confirmComment)

module.exports = router
