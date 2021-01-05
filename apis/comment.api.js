const router = require('express').Router()
const commentCtl = require('../controllers/comment.controller')
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')

router
    .route('/comments')
    .post(auth, commentCtl.create)
    .get(auth, authAdmin, commentCtl.getAllByAdmin)

router.route('/product/:id/comments').get(commentCtl.getAllByProduct)
router
    .route('/comments/:id')
    .get(auth, commentCtl.getOne)
    .delete(auth, authAdmin, commentCtl.delete)
    .put(auth, authAdmin, commentCtl.confirmComment)

module.exports = router
