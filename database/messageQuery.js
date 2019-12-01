var db = require('./createPool');

module.exports = {
    addMessage: async (conv_id, user_send, content) => {
        try {

            var result = await db.query('insert message(conv_id,user_send,content) values (?,?,?)', [conv_id, user_send, content]);
            debugger
            await db.query('update conversation set lasttime=current_timestamp() where conv_id=? ', [conv_id]);

            return result[0].insertId;

        } catch (err) {
            console.log(err);
            return false;
        }
    },
    addAttachment: async (conv_id, user_send, filetype, filename, filepath) => {

        var result = await db.query('insert message(conv_id,user_send,content,type,filepath) values (?,?,?,?,?)', [conv_id, user_send, filename, filetype, filepath]);
        await db.query('update conversation set lasttime=current_timestamp() where conv_id=? ', [conv_id]);

        return result[0].insertId;
    },
    getMessage: async (conv_id, page) => {
        try {
            var offset = (page - 1) * 10;
            var res = await db.query('select * from message where conv_id=? order by sendtime desc limit ?,?', [conv_id, offset, 10])
            return res[0];
        } catch (err) {
            console.log(err);
            return false;
        }
    },
    getPreviewMessage: async (conv_id) => {
        try {
            var res = await db.query('select * from message where conv_id=? order by sendtime desc limit 1', [conv_id])
            return res[0][0];
        } catch (err) {
            console.log(err);
            return false;
        }
    },
    readAllMessage: async (conv_id, user_send) => {
        try {
            
            var res = await db.query('select * from message where conv_id= ? and user_send <> ?', [conv_id, user_send]);
            
            if (res[0].length >= 1) {
               
                res[0].forEach(async (message) => {
                    var find = await db.query('select * from seen_message where message_id=? and user_id=?', [message.message_id, user_send]);
                    if (find[0].length == 0)
                        await db.query('insert into seen_message(message_id,user_id) values (?,?)', [message.message_id, user_send])
                });
            }
            return true
        } catch (err) {
            console.log(err);
            return false;
        }
    },
    readMessageById: async (message_id, user_id) => {
        try {
            var find = await db.query('select * from seen_message where message_id=? and user_id=?', [message_id, user_id]);
            if (find[0].length == 0)
                await db.query('insert into seen_message(message_id,user_id) values (?,?)', [message_id, user_id]);
            return true;
        } catch (err) {
            console.log(err);
            return false;
        }
    },
    getSeenUsers: async(message_id)=>{
        try{
            var list=[];
            var result= await db.query('select user_id from seen_message where message_id=?',[message_id]);
            result[0].forEach(element => {
                list.push(element.user_id);
            });
            console.log(list);
            return list;
        }catch(err){
            console.log(err);
            return false;
        }
    }
}