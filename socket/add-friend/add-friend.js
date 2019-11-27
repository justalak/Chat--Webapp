var helper= require('../../helper/socketHelper');

var addFriend =(io) =>{
    let clients={};
    io.on('connection',function(socket){
        socket.on('connected', (data)=>{
            clients=helper.pushSocketIdToArray(clients,data.user_id,socket.id);   
                 
            socket.on('add-friend',(data)=>{
                console.log(data)
                helper.emitNotifyToArray(clients, data.user_receive,socket, 'add-friend', data);
            })
            socket.on('disconnect',()=>{
                clients=helper.removeSocketIdFromArray(clients,data.user_id,socket);
            })
        });
        
    })
}

module.exports=addFriend;