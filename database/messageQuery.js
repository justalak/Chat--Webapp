var db =require('./createPool');

module.exports={
    addMessage: async(conv_id,user_send,content)=>{
        try{
            var res=await db.query('insert message(conv_id,user_send,content) values (?,?,?)',[conv_id,user_send,content]);
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
    }
}