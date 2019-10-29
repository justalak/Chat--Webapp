var userOnlineOffline=require('./statusUser/userOnlineOffline');
var sendReceiveMessage=require('./message/send-receive-message');
initSocket =(io)=>{
    userOnlineOffline(io);
    sendReceiveMessage(io);
}

module.exports= initSocket;