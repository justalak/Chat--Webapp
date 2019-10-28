var userOnlineOffline=require('./statusUser/userOnlineOffline');
initSocket =(io)=>{
    userOnlineOffline(io);
}

module.exports= initSocket;