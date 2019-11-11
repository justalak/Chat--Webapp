var db=require('../database/userQuery');
var uploader=require('../uploader/profileImage');
var config=require('../config/config');

module.exports={
    getUser: async(req,res)=>{
        var user= await db.getUser(req.params.user_id);
        res.json(user);
    },
    updateProfile:(req,res)=>{
        var user_id=req.session.user.user_id;

        uploader.uploadProfileImage(req,user_id);

        res.end();
    }
}