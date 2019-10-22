var db=require('../database/loginQuery');

module.exports={
    login: async (req,res)=>{
        var data={};
        var result=await db.getUser(req.body);
        if(result===false){
            data['result']=false;
            data['body']=req.body;
        }
        else{
            data['username']=result['username'];
            data['password']=result['password'];
            data['result']=true;
            req.session.user=result;
        } 
        res.json(data);
    },
    register: async (req,res)=>{
        var data={};
        var result=await db.addUser(req.body);
        data['result']=result;
        res.json(data);
    },
    
}