var userOnlineOffline=require('./statusUser/userOnlineOffline');
var sendReceiveMessage=require('./message/send-receive-message');
var typingOnOff= require('./message/typing-on-off');
initSocket =(io)=>{
    userOnlineOffline(io);
    sendReceiveMessage(io);
    typingOnOff(io);
}

module.exports= initSocket;