var helper = require('../../helper/socketHelper');
var db = require('../../database/messageQuery')

var sendReceiveMessage = (io) => {
    let clients = {};
    io.on('connection', function (socket) {
        socket.on('connected', (data) => {
            clients = helper.pushSocketIdToArray(clients, data.user_id, socket.id);
            console.log(clients);
            socket.on('new-message', async (message) => {
                await db.addMessage(message.conv_id, message.user_send, message.content);
                if (clients[message.user_receive]) {
                    helper.emitNotifyToArray(clients, message.user_receive,socket, 'new-message', message)
                }
            })
            socket.on('read-message',async (data)=>{
                await db.readMessage(data.conv_id,data.user_send);
                if (clients[data.user_receive]) {
                    helper.emitNotifyToArray(clients, data.user_receive,socket, 'read-message', data)
                }
            })
            socket.on('disconnect', () => {
                clients = helper.removeSocketIdFromArray(clients, data.user_id, socket);
            })
        })
    })
}

module.exports = sendReceiveMessage;