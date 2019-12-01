var helper = require('../../helper/socketHelper');
var db = require('../../database/messageQuery')

var sendReceiveMessage = (io) => {
    let clients = {};
    io.on('connection', function (socket) {
        socket.on('connected', (data) => {
            clients = helper.pushSocketIdToArray(clients, data.user_id, socket.id);
            
            socket.on('new-message', async (message) => {
               
                var friends=message.user_receive;
                friends.forEach(friend_id => {
                    if (clients[friend_id]) {
                        helper.emitNotifyToArray(clients, friend_id,socket, 'new-message', message)
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