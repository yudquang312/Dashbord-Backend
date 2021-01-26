const jwt = require('jsonwebtoken')

const auth = async (req, res, next) => {
    try {
        // console.log(req.headers.authorization)
        // const token = req.headers.authorization
        // if (!token) {
        //     console.log(1)
        //     return res.status(400).json({
        //         msg: 'Token does not exist',
        //     })
        // }
        // jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        //     if (err) {
        //         return res.status(400).json({
        //             msg: 'Invalid Authorization',
        //         })
        //     }
        //     req.user = user
        //     console.log('middleware : ', user)
        //     next()
        // })
        next()
    } catch (e) {
        return res.status(500).json({
            msg: e.message,
        })
    }
}

module.exports = auth
