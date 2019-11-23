var db =require('./createPool');

module.exports={
    getUser: async(user_id)=>{
        try{
        var res=await db.query('select * from user where user_id=?',[user_id]);
        return res[0][0];
        }catch(err){
            console.log(err);
            return false
        }
    },
    getInfor: async(username)=>{
        try{
            var res=await db.query('select * from user where username=?',[username]);
            return res[0][0];
            }catch(err){
                console.log(err);
                return false
            }
    },
    updateProfile: async (user_id,img_url)=>{
        try{
            await db.query('update user set profile_img=? where user_id=?',[img_url,user_id]);
            return true;
        }catch(err){
            console.log(err);
            return false;
        }
    }
}