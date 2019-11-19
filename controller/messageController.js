var db = require('../database/messageQuery');
var uploader = require('../uploader/messageAttachment');
var formidable = require('formidable');
var fs = require('fs');
var config = require('../config/config')
module.exports = {
    getMessage: async (req, res) => {
        var messages = await db.getMessage(req.params.conv_id, req.params.page);
        res.json(messages);
    },
    addMessage: async (req, res) => {
        await db.addMessage(req.body.conv_id, req.body.user_send, req.body.content);
    },
    addAttachment: async (req, res) => {
        var form = new formidable.IncomingForm();
        var user_send = req.params.user_send;
        var conv_id = req.params.conv_id;

        form.uploadDir = 'public/Images/message-attachment/';
        form.parse(req);

        form.on('file', async (name, file) => {

            var oldpath = file.path;
            var newname = file.name;

            // var salt=0;
            // while(fs.existsSync(newpath)){
            //     salt++;
            // }
            // if(salt!=0){
            //     newname=salt+'_'+newname
            // }

            var newpath = form.uploadDir + newname;
            var filepath = config.attachmentDir + newname;
            var type;
            if (file.type.substring(0, 5) == 'image')
                type = 'image';
            else type = 'file';
            await db.addAttachment(conv_id, user_send,type, newname, filepath);

            fs.rename(oldpath, newpath, (err) => {
                if (err) console.log(err);
            })
            res.json({ filename: newname, filetype: type, filepath: filepath });
        });

        form.on('end', function () {

        });
    },
    getPreview: async (req, res) => {
        var preview = await db.getPreviewMessage(req.params.conv_id);
        res.json(preview);
    }
}