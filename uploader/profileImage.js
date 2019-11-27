var formidable = require('formidable');
var fs = require('fs');
var db = require('../database/userQuery');
var config = require('../config/config')

module.exports = {
    uploadProfileImage: async(req, user_id) => {
        var form = new formidable.IncomingForm();
        var result;
        form.uploadDir = 'public/Images/profile-picture/';
        form.parse(req);

        await new Promise(async (resolve,reject)=>{
            form.on('file', async (name, file) => {

                var oldpath = file.path;
                var newname = user_id + '_' + file.name;
                var newpath = form.uploadDir + newname;
                var filepath = config.profileImageDir + newname;
    
                await db.updateProfile(user_id, filepath);
    
                fs.rename(oldpath, newpath, (err) => {
                    if (err) console.log(err);
                });
                return resolve(filepath);
            });
            form.on('end', function () {

            });
        }).then((res)=>{
            
            result=res;
        }); 
        return result;
    },
    
}