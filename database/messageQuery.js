var db =require('./createPool');

module.exports={
    addMessage: async(conv_id,user_send,content)=>{
        try{
            var time=new Date().toISOString().slice(0, 19).replace('T', ' ');
            await db.query('insert message(conv_id,user_send,content) values (?,?,?)',[conv_id,user_send,content]);
            await db.query('update conversation set lasttime=? where conv_id=? ',[time,conv_id]);
        }catch(err){
            console.log(err);
            return false;
        }
    },
    getMessage: async(conv_id,page)=>{
        try{
            var offset=(page-1)*10;
            var res=await db.query('select * from message where conv_id=? order by sendtime desc limit ?,?',[conv_id,offset,10])
            return res[0];
        }catch(err){
            console.log(err);
            return false;
        }
    },
    getPreviewMessage: async(conv_id)=>{
        try{
            var res=await db.query('select * from message where conv_id=? order by sendtime desc limit 1',[conv_id])
            return res[0][0];
        }catch(err){
            console.log(err);
            return false;
        }
    },
    readMessage: async (conv_id,user_send)=>{
        try{
            var res=await db.query('select * from message where conv_id=? and user_send <>? and seen = 0',[conv_id,user_send]);
            if(res[0].length >=1) {
                res[0].forEach(async (message) => {
                    await db.query('update message set seen=1 where message_id=?',[message.message_id]);
                });
            }
        }catch(err){
            console.log(err);
            return false;
        }
    }
}