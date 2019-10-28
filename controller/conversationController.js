var db=require('../database/conversationQuery');

module.exports={
    getConversation: async(req,res)=>{
        var result=await db.loadConversation(req.session.user.user_id);
        res.json(result);
    }
}