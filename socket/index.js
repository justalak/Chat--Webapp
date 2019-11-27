var userOnlineOffline=require('./statusUser/userOnlineOffline');
var sendReceiveMessage=require('./message/send-receive-message');
var typingOnOff= require('./message/typing-on-off');
var videoCall=require('./video-call/videoCall');
var addFriend=require('./add-friend/add-friend')
initSocket =(io)=>{
    userOnlineOffline(io);
    sendReceiveMessage(io);
    typingOnOff(io);
    videoCall(io);
    addFriend(io);
}

module.exports= initSocket;