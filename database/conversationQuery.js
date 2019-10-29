var db = require('./createPool');

module.exports = {
    loadConversation: async(user_id) => {
        try {
            var result = [];
            var res = await db.query('select conv_id from user_conv where user_id=?', [user_id]);
            var list = res[0];
            for(var i=0;i<list.length;i++){
                var res = await db.query('select user_id from user_conv where conv_id=? and user_id <> ?', [list[i].conv_id, user_id]);
                if (res[0].length <= 1) {
                    var userres= await db.query('select* from user where user_id=?',[res[0][0].user_id]);
                    result.push({ user: userres[0][0], conv_id: list[i].conv_id })
                }
            }
            return result;
        } catch (err) {
            console.log(err);
            return false;
        }
    }
}