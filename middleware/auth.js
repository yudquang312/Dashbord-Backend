const jwt = require('jsonwebtoken')

const auth = async (req, res, next) => {
    try {
        const token = req.headers.authorization
        if (!token) {
            return res.status(400).json({
                msg: 'Token does not exist',
            })
        }
        const a = await jwt.decode(token)
        console.log(a)
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) {
                return res.status(400).json({
                    msg: 'Invalid Authorization',
                })
            }
            req.user = user
            next()
        })
    } catch (e) {
        return res.status(500).json({
            msg: e.message,
        })
    }
}

module.exports = auth
