var helper= require('../../helper/socketHelper');

var userOnlineOffline =(io) =>{
    let clients={};
    io.on('connection',function(socket){
        socket.on('connected', (data)=>{
            clients=helper.pushSocketIdToArray(clients,data.user_id,socket.id);        
            socket.on('check-status',()=>{
                socket.emit('online-list',Object.keys(clients))
            })
            
            socket.broadcast.emit('user-online',data.user_id);

            socket.on('disconnect',()=>{
                clients=helper.removeSocketIdFromArray(clients,data.user_id,socket);
                
                socket.broadcast.emit('user-offline',data.user_id);
            })
        });
        
    })
}

module.exports=userOnlineOffline;