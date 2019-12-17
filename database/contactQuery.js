var db = require('./createPool');

module.exports = {
    getContact: async (user_id) => {
        var result = {};
        var query1 = 'select user1.* ' +
            'from contact, user user1, user user2 ' +
            'where (user1.user_id=contact.user1_id and user2.user_id=contact.user2_id) ' +
            'and (user2.user_id=?)';

        var query2 = 'select user2.* ' +
            'from contact, user user1, user user2 ' +
            'where (user1.user_id=contact.user1_id and user2.user_id=contact.user2_id) ' +
            'and (user1.user_id=?) ';

        try {
            var list = await db.query(query1 + ' union ' + query2 + ' order by firstname', [user_id, user_id]);

            return list[0];
        } catch (err) {
            return false;
        }
    },
    addContact: async (user_id, name) => {
        var result = {};
        try {
            var add = await db.query('select * from user where username=? or email=?', [name,name]);

            if (add[0].length < 1) {
                result['result'] = false;
            }
            
            else {
                var user2_id = add[0][0].user_id;
                var getContact = await db.query('select * from contact where (user1_id=? and user2_id=?) or(user1_id=? and user2_id=?)',
                    [user_id, user2_id, user2_id, user_id]);

                if (getContact[0].length > 0) result['result'] = true;
                else {
                    await db.query('insert into contact(user1_id,user2_id) values(?,?)', [user_id, user2_id]);
                    var res = await db.query('insert into conversation values()');

                    var conv_id = res[0].insertId;

                    await db.query('insert into user_conv(user_id, conv_id) values (?,?)', [user_id, conv_id]);
                    await db.query('insert into user_conv(user_id, conv_id) values (?,?)', [user2_id, conv_id]);
                }
                result['newuser'] = add[0][0];
            }
            return result;
        } catch (err) {
            console.log(err);
            return false;
        }
    },
    getNotification: async (user_id) => {
        var list = [];
        var res =await db.query('select user1_id,user2_id from contact where (user1_id=? and user1_seen=0) or (user2_id=? and user2_seen=0) order by create_time desc',
            [user_id, user_id]);
        res[0].forEach(element => {
            if (element.user1_id == user_id)
                list.push(element.user2_id);
            else
                list.push(element.user1_id);
        });
        return list;
    },
    checkNotifications: async(user_id)=>{
        try{

        await db.query('update contact set user1_seen=1 where (user1_id=? and user1_seen=0)',[user_id]);
        await db.query('update contact set user2_seen=1 where (user2_id=? and user2_seen=0)',[user_id]);
        
        return true;
        }catch(err){
            console.log(err);
            return false;
        }
    }
}