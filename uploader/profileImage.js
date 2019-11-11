var formidable=require('formidable');
var fs=require('fs');
var db=require('../database/userQuery');
var config=require('../config/config')

module.exports={
    uploadProfileImage: (req,user_id)=>{
    var form=new formidable.IncomingForm();
    
    form.uploadDir='public/Images/profile-picture/';
    form.parse(req);
    

    form.on('file',async(name,file)=>{
        
        var oldpath=file.path;
        var newname=user_id+'_'+file.name;
        var newpath=form.uploadDir+newname;
        var filepath=config.profileImageDir+newname;

        await db.updateProfile(user_id, filepath);

        fs.rename(oldpath,newpath,(err)=>{
            if(err) console.log(err);
        })
    });

    form.on('end', function() {
        
    });
    }
}