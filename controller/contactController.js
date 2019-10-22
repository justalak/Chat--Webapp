var db=require('../database/contactQuery');

module.exports={
    getContact: async(req,res)=>{
        var result=await db.getContact(req.session.user.user_id);
        res.json(result);
    },
    addContact: async(req,res)=>{
        var data={}
        var result= await db.addContact(req.session.user.user_id,req.params.name);
        res.json(result);
    }
}