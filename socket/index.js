const Comment = require('../models/comment.model')

const handler = (server) => {
    let users = []
    const io = require('socket.io')(server, {
        cors: {
            origin: 'http://localhost:3000',
            methods: ['GET', 'POST'],
            allowedHeaders: ['my-custom-header'],
            credentials: true,
        },
    })
    io.on('connection', (socket) => {
        console.log(socket.id + ' connected')

        socket.on('joinRoom', (id) => {
            const user = { userId: socket.id, room: id }
            console.log('id', id)
            const check = users.every((user) => user.userId !== socket.id)

            if (check) {
                users.push(user)
                socket.join(user.room)
            } else {
                users.map((user) => {
                    if (user.userId === socket.id) {
                        if (user.room !== id) {
                            socket.leave(user.room)
                            socket.join(id)
                            user.room = id
                        }
                    }
                })
            }

            console.log('user', users)
        })

        socket.on('createComment', async (msg) => {
            const { id, userId, content, productId, username, send } = msg
            const newComment = new Comment({
                userId,
                content,
                productId,
            })

            if (send === 'replyComment') {
                const {
                    _id,
                    userId,
                    content,
                    productId,
                    createdAt,
                } = newComment

                const comment = await Comment.findOne({ _id: id }).populate({
                    path: 'userId',
                    select: 'name',
                })
                console.log(comment.productId)
                if (comment) {
                    comment.reply.push({
                        _id,
                        userId,
                        username,
                        content,
                        createdAt,
                    })
                    const data = await comment.save()
                    io.to(comment.productId).emit(
                        'sendReplyCommentToClient',
                        data,
                    )
                }
            } else {
                const data = await newComment
                    .save()
                    .then((t) => t.populate('userId').execPopulate())
                io.to(productId).emit('sendCommentToClient', data)
            }
        })

        socket.on('disconnect', () => {
            users = users.filter((us) => us.userId !== socket.id)
            console.log('users:', users)
            console.log(socket.id + ' disconnected')
        })
    })
}

module.exports = handler
