const { Router } = require('express')
const routes = new Router();
const UserController = require('./apps/controllers/UserController')
const MessageController = require('./apps/controllers/MessageController')

routes.get('/health', (req, res) => {
    return res.send({ message: 'Connected with success!'})
})

routes.post('/user', UserController.insert);

routes.get('/user/:email', UserController.getUser)

routes.get('/user', UserController.getAllUsers)

routes.post('/message', MessageController.sendMessage)

routes.get('/message/:userId/:myId', MessageController.listAllMessages)

module.exports = routes