var db=require('../database/userQuery');
var uploader=require('../uploader/profileImage');
var config=require('../config/config');

module.exports={
    getUser: async(req,res)=>{
        var user= await db.getUser(req.params.user_id);
        res.json(user);
    },
    getInfor:async(req,res)=>{
        var user= await db.getInfor(req.params.username);
        res.json(user);
    },
    updateProfile:async(req,res)=>{
        var user_id=req.session.user.user_id;
        var filepath=await uploader.uploadProfileImage(req,user_id);
        
        console.log(filepath);
        res.json(filepath);
    }
}