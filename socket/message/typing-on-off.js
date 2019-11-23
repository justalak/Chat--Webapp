var helper = require('../../helper/socketHelper');
var db = require('../../database/messageQuery')

var typingOnOff = (io) => {
    let clients = {};
    io.on('connection', function (socket) {
        socket.on('connected', (data) => {
            clients = helper.pushSocketIdToArray(clients, data.user_id, socket.id);
            socket.on('typing-on', (data) => {
                var friends=data.user_receive;
                friends.forEach(friend_id => {
                    if (clients[friend_id]) {
                        helper.emitNotifyToArray(clients, friend_id,socket, 'typing-on', data)
                    }
                });
            })
            socket.on('typing-off',(data)=>{
                var friends=data.user_receive;
                friends.forEach(friend_id => {
                    if (clients[friend_id]) {
                        helper.emitNotifyToArray(clients, friend_id,socket, 'typing-off', data)
                    }
                });
            })
            socket.on('disconnect', () => {
                clients = helper.removeSocketIdFromArray(clients, data.user_id, socket);
               
            })
        })
    })
}
module.exports=typingOnOff;