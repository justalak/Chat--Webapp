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
                var friends=message.user_receive;
                friends.forEach(friend_id => {
                    if (clients[friend_id]) {
                        helper.emitNotifyToArray(clients, friend_id,socket, 'new-message', message)
                    }
                });
               
            })
            socket.on('read-message',async (data)=>{
                await db.readMessage(data.conv_id,data.user_send);
                var friends=data.user_receive;
                friends.forEach(friend_id => {
                    if (clients[friend_id]) {
                        helper.emitNotifyToArray(clients, friend_id,socket, 'read-message', data)
                    }
                });
               
            })
            socket.on('new-file',(data)=>{
                var friends=data.user_receive;
                friends.forEach(friend_id => {
                    if (clients[friend_id]) {
                        helper.emitNotifyToArray(clients, friend_id,socket, 'new-file', data)
                    }
                });
               
            })
            socket.on('disconnect', () => {
                clients = helper.removeSocketIdFromArray(clients, data.user_id, socket);
            })
        })
    })
}

module.exports = sendReceiveMessage;