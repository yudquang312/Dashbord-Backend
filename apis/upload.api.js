const router = require('express').Router()
const uploadImage = require('../helper/upload-image')
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')
const upload = require('../controllers/upload.controller')

router.post(
    '/upload_avatar',
    auth,
    uploadImage.uploadSingleImage,
    upload.uploadAvatar,
)

router.post(
    '/upload_single',
    auth,
    uploadImage.uploadSingleImage,
    upload.upload,
)

router.post(
    '/upload_multi',
    auth,
    uploadImage.uploadMultipleImage,
    upload.uploadProduct,
)
router.post('/destroy/:public_id', auth, authAdmin, upload.delete)

module.exports = router
