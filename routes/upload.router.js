const router = require('express').Router()
const uploadImage = require('../helper/upload-image')
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')
const upload = require('../controllers/upload.controller')

router.post('/upload_avatar', uploadImage, auth, upload.uploadAvatar)
router.post('/upload', uploadImage, auth, upload.upload)
router.post('/destroy/:public_id', auth, authAdmin, upload.delete)
module.exports = router
