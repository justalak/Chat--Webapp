var db=require('../database/userQuery');

module.exports={
    getUser: async(req,res)=>{
        var user= await db.getUser(req.params.user_id);
        res.json(user);
    }
}