var db = require('./createPool');

module.exports = {
    loadConversationList: async (user_id, type) => {
        try {
            var result = [];

            var res = await db.query('SELECT * FROM user_conv,conversation ' +
                ' where (user_conv.conv_id=conversation.conv_id) and user_id=? ' +
                ' order by lasttime desc', [user_id]);

            var list = res[0];

            for (var i = 0; i < list.length; i++) {
                var friends = await db.query('select user_id from user_conv where conv_id=? and user_id <> ?', [list[i].conv_id, user_id]);
                var friends_id = [];

                friends[0].forEach(friend => {
                    friends_id.push(friend.user_id);
                });

                if (type == 'all') {
                    result.push({ friends_id: friends_id, conversation: list[i] })
                }
                else if (type == 'single') {
                    if (friends_id.length == 1)
                        result.push({ friends_id: friends_id, conversation: list[i] })
                }
                else {
                    if (friends_id.length > 1)
                        result.push({ friends_id: friends_id, conversation: list[i] })
                }
            }
            return result;
        } catch (err) {
            console.log(err);
            return false;
        }
    },
    getConversation: async (conv_id) => {
        try {
            var res = await db.query('select * from conversation where conv_id=?', [conv_id]);
            return res[0][0];
        } catch (err) {
            console.log(err);
            return false
        }
    },
    createGroupChat: async (memberList, groupName, user_host) => {
        try {
            var result = await db.query('insert into conversation(name) values (?)', [groupName]);

            var conv_id = result[0].insertId;

            await db.query('insert into user_conv(user_id, conv_id) values (?,?)', [user_host, conv_id]);
            // memberList.forEach(async (member) => {
            //     await db.query('insert into user_conv(user_id, conv_id) values (?,?)',[member,conv_id]);
            // });
            for (var i = 0; i < memberList.length; i++) {
                await db.query('insert into user_conv(user_id, conv_id) values (?,?)', [memberList[i], conv_id]);
            }
            return true;
        }
        catch (err) {
            console.log(err);
            return false;
        }
    },
    changeGroupName: async (conv_id, newname) => {
        try {
            var res = await db.query('update conversation set name=? where conv_id=?', [newname, conv_id]);
            return true;
            
        } catch (err) {
            console.log(err);
            return false;
        }
    },
    addMembersToGroup: async (conv_id, listMembers) => {
        try {
            for (var i = 0; i < listMembers.length; i++) {
                await db.query('insert into user_conv(user_id,conv_id) values(?,?)', [listMembers[i], conv_id]);
            }
            return true;
        } catch (err) {
            console.log(err);
            return false;
        }
    }
}
