const Message = require('../models/Messages')
const User = require('../models/Users')
const crypto = require('crypto')
const moment = require('moment')
const { compare } = require('../../utils')

class MessageController {
    async sendMessage(req, res) {
        const { text, user_send, user_destination} = req.body

        if(user_destination == user_send) {
            return res.status(400).json({ message: "você não pode enviar mensagem para você mesmo!"})
        }

        const message = await Message.create({
            text: text,
            user_id: user_send,
            user_destination: user_destination
        })

        const formattedData = {
            id: message.id,
            text: message.text,
            user_id: message.user_id
        }

        //encryptou o id do usuário 
        const receiver = crypto.createHash('md5').update(`${user_destination}`).digest('hex')

        //fez o envio da mensagem com o id
        req.io.emit(`${receiver}`, formattedData)

        return res.status(200).json(formattedData)
    }

    async listAllMessages(req, res) {
        const { userId, myId } = req.params

        const messageReceiver = await Message.findAll({
            raw: true,
            nest: true,
            attributes: ['id', 'text','createdAt'],
            include: [
                {
                    model: User, as: 'user',
                    attributes: ['name','id']
                }
            ],
            where: {
                user_id: userId,
                user_destination: myId
            }
        })

        const messageSend = await Message.findAll({
            raw: true,
            nest: true,
            attributes: ['id', 'text','createdAt'],
            include: [
                {
                    model: User, as: 'user',
                    attributes: ['name','id']
                }
            ],
            where: {
                user_id: myId,
                user_destination: userId
            }
        })

        const messages = [...messageReceiver, ...messageSend]

        if(messages.length === 0) {
            return res.status(404).jons({ message: "Sem mensagem para carregar!"})
        }

        const formattedData = []
        moment.locale('pt-br')

        for (const item of messages) {
            formattedData.push({
                id: item.id,
                text: item.text,
                hour: moment(item.createdAt).format('hh:mm'),
                user: item.user.name,
                userId: item.user.id,
            })
        }

        formattedData.sort(compare)

        return res.status(200).json(formattedData)
    }

}

module.exports = new MessageController()