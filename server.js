require('dotenv').config()
const express = require('express')
const cors = require('cors')
const fileUpload = require('express-fileupload')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
const path = require('path')

const app = express()
app.use(express.json())
const header = {
    'Access-Control-Allow-Origin': '*',
}
app.use(
    cors({
        origin: 'http://localhost:3000',
        method: 'GET,HEAD,PUT,PATCH,DELETE,POST',
        allowedHeaders: 'Content-Type, Accept, Authorization',
        credentials: true,
    }),
)
app.use(cookieParser())
app.use(
    fileUpload({
        useTempFiles: true,
    }),
)
// app.options('*', cors())

app.use('/user', require('./routes/user.router'))
//connect database
require('./helper/init-mongoose')
// Routes
// app.use('/api', require('./routes/upload'))

// if (process.env.NODE_ENV === 'production') {
//     app.use(express.static('client/build'))
//     app.get('*', (req, res) => {
//         res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'))
//     })
// }
const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log('Server is runing port ', PORT))
