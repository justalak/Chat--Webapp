var helper = require('../../helper/socketHelper');
var db = require('../../database/messageQuery')

var typingOnOff = (io) => {
    let clients = {};
    io.on('connection', function (socket) {
        socket.on('connected', (data) => {
            clients = helper.pushSocketIdToArray(clients, data.user_id, socket.id);
            socket.on('typing-on', (data) => {
                if (clients[data.user_receive]) {
                    helper.emitNotifyToArray(clients, data.user_receive,socket, 'typing-on', data);
                }
            })
            socket.on('typing-off',(data)=>{
                if (clients[data.user_receive]) {
                    helper.emitNotifyToArray(clients, data.user_receive,socket, 'typing-off', data);
                }
            })
            socket.on('disconnect', () => {
                clients = helper.removeSocketIdFromArray(clients, data.user_id, socket);
                if (clients[data.user_receive]) {
                    helper.emitNotifyToArray(clients, data.user_receive,socket, 'typing-off', data);
                }
            })
        })
    })
}
module.exports=typingOnOff;