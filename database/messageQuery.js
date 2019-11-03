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
    getMessage: async(conv_id)=>{
        try{
            var res=await db.query('select * from message where conv_id=? order by sendtime',[conv_id])
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
    }
}