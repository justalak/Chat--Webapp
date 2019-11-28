var db=require('../database/conversationQuery');

module.exports={
    loadConversation: async(req,res)=>{
        var result=await db.loadConversationList(req.session.user.user_id,req.params.type);
        res.json(result);
    },
    getConversation: async(req,res)=>{
        var conversation= await db.getConversation(req.params.conv_id);
        res.json(conversation);
    },
    createGroupChat: async(req,res)=>{
        var result=await db.createGroupChat(req.body.memberList,req.body.groupName,req.body.userHost);
        res.json(result);
    },
    changeGroupName: async(req,res)=>{
       
        var result=await db.changeGroupName(req.params.conv_id,req.body.newname);
        res.json(result);
    },
    addMembersToGroup: async(req,res)=>{
        var result=await db.addMembersToGroup(req.params.conv_id,req.body.newMembers);
        res.json(result);
    }
}