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
    }
}