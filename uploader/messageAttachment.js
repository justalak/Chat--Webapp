var formidable = require('formidable');
var fs = require('fs');
var db = require('../database/messageQuery');
var config = require('../config/config')

module.exports={
    sendAttachment: (req,res) => {
        var form = new formidable.IncomingForm();
        var user_send=req.params.user_send;
        var conv_id=req.params.conv_id;

        form.uploadDir = 'public/Images/message-attachment/';
        form.parse(req);

        form.on('file', async (name, file) => {

            var oldpath = file.path;
            var newname = file.name;
           
            var newpath = form.uploadDir + newname;
            var filepath = config.attachmentDir + newname;

            await db.addAttachment(conv_id,user_send,file.type,newname,filepath);

            fs.rename(oldpath, newpath, (err) => {
                if (err) console.log(err);
            })
            res.json({filename:newname,filetype:file.type,filepath:filepath});
        });

        form.on('end', function () {

        });
    }
}