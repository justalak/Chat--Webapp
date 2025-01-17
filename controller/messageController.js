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
       var message_id= await db.addMessage(req.body.conv_id, req.body.user_send, req.body.content);
       res.json(message_id);
    },
    addAttachment: async (req, res) => {
        var form = new formidable.IncomingForm();
        var user_send = req.params.user_send;
        var conv_id = req.params.conv_id;

        form.uploadDir = 'public/Images/message-attachment/';
        form.parse(req);

        form.on('file', async (name, file) => {

            var oldpath = file.path;
            var newname = conv_id+'_'+new Date().getTime()+'_'+file.name;

            var newpath = form.uploadDir + newname;
            var filepath = config.attachmentDir + newname;
            var type;
            if (file.type.substring(0, 5) == 'image')
                type = 'image';
            else type = 'file';
            var message_id=await db.addAttachment(conv_id, user_send,type, file.name, filepath);

            fs.rename(oldpath, newpath, (err) => {
                if (err) console.log(err);
            })
            res.json({ message_id:message_id,filename: newname, filetype: type, filepath: filepath });
        });

        form.on('end', function () {

        });
    },
    getPreview: async (req, res) => {
        var preview = await db.getPreviewMessage(req.params.conv_id);
        res.json(preview);
    },

    readAllMessage: async(req,res)=>{
        var result =await db.readAllMessage(req.params.conv_id,req.session.user.user_id);
        res.json(result);
    },
    readMessageById: async(req,res)=>{
        var result=await db.readMessageById(req.params.message_id,req.body.user_send);
        res.json(result);
    },
    getSeenUsers: async(req,res)=>{
        var result=await db.getSeenUsers(req.params.message_id);
        res.json(result);
    },
    checkMessageStatus: async(req,res)=>{
        var result= await db.isMessageSeen(req.params.message_id,req.params.user_id);
        res.json(result);
    }

}