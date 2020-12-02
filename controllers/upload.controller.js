const fs = require('fs')
const cloudinary = require('cloudinary')
const { uploadMultipleImage } = require('../helper/upload-image')

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
})

const uploadCtl = {
    uploadAvatar: async (req, res, next) => {
        try {
            const file = req.files.file

            cloudinary.v2.uploader.upload(
                file.tempFilePath,
                {
                    folder: 'Dinosuar_shop/avatar',
                    width: 150,
                    height: 150,
                    crop: 'fill',
                },
                async (err, results) => {
                    if (err) throw err
                    removeTmp(file.tempFilePath)
                    res.status(200).json({
                        public_id: results.public_id,
                        url: results.secure_url,
                    })
                },
            )
        } catch (e) {
            return res.status(500).json({ msg: e.messages })
        }
    },
    upload: async (req, res, next) => {
        try {
            const file = req.files.file

            cloudinary.v2.uploader.upload(
                file.tempFilePath,
                {
                    folder: 'Dinosuar_shop/products',
                },
                async (err, results) => {
                    if (err) throw err
                    removeTmp(file.tempFilePath)
                    res.status(200).json({
                        url: results.secure_url,
                    })
                },
            )
        } catch (e) {
            return res.status(500).json({ msg: e.messages })
        }
    },
    delete: async (req, res, next) => {
        try {
            const { public_id } = req.params
            if (!public_id)
                return res.status(400).json({
                    msg: 'No image selected',
                })
            cloudinary.v2.uploader.destroy(public_id, async (err, results) => {
                if (err) throw err
                res.status(200).json({
                    msg: 'Deleted image',
                })
            })
        } catch (e) {
            return res.status(500).json({ msg: e.messages })
        }
    },
    uploadProduct: async (req, res, next) => {
        try {
            let data = new Array()
            const multiUpload = new Promise(async (resolve, reject) => {
                for (let i = 0; i <= req.files.file.length; i++) {
                    if (i === req.files.file.length) return resolve(data)
                    let tamp = {}
                    let file = req.files.file[i]
                    await cloudinary.v2.uploader.upload(
                        file.tempFilePath,
                        {
                            folder: 'Dinosuar_shop/products',
                            width: 300,
                            height: 300,
                            crop: 'fill',
                        },
                        (error, result) => {
                            if (error) {
                                console.log(error)
                                reject(error)
                            } else if (result) {
                                removeTmp(file.tempFilePath)
                                tamp.public_id = result.public_id
                                tamp.url = result.secure_url
                                data.push(tamp)
                            }
                        },
                    )
                }
            })
                .then((result) => result)
                .catch((err) => err)

            const results = await multiUpload
            res.status(200).json(results)
        } catch (e) {
            return res.status(500).json({ msg: e.messages })
        }
    },
}

const removeTmp = (path) => {
    fs.unlink(path, (err) => {
        if (err) throw err
    })
}

module.exports = uploadCtl
