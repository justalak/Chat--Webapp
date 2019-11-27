var helper = require('../../helper/socketHelper');


var videoCall = (io) => {
    let clients = {};
    io.on('connection', function (socket) {
        socket.on('connected', (data) => {
            clients = helper.pushSocketIdToArray(clients, data.user_id, socket.id);
            socket.on('video-call',(data)=>{
                helper.emitNotifyToArray(clients, data.listener,socket, 'video-call', data);
            });
            socket.on('answer-call',(data)=>{
                helper.emitNotifyToArray(clients, data.caller,socket, 'answer-call', data);
            })
            socket.on('ready-to-call',(data)=>{
                helper.emitNotifyToArray(clients, data.listener,socket, 'ready-to-call', data)
            });
            socket.on('disconnect', () => {
                clients = helper.removeSocketIdFromArray(clients, data.user_id, socket);
            })
        })
    })
}

module.exports = videoCall;