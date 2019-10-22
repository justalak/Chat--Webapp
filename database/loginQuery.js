
var bcrypt = require('bcrypt');
var db =require('./createPool');

module.exports = {
    getUser: async (user) => {
        var result;
        try {
            result = await db.query('select * from user where username=? ', [user['username']]);
            var dbpassword = result[0][0].password;
            var res = await bcrypt.compareSync(user['password'], dbpassword);

            if (!res) return false;
            else return result[0][0];
        } catch{
            return false;
        }
    },
    addUser: async (user) => {
        var result;
        try {
            var salt = await bcrypt.genSaltSync(10);
            var password = await bcrypt.hashSync(user['password'], salt);
            await db.query('insert into user(username,password,firstname,lastname,email,gender) values(?,?,?,?,?,?)',
                [user['username'], password, user['firstname'], user['lastname'], user['email'], user['gender']]
            );
            return true;
        } catch (ex) {
            return ex;
        }
    },
    
}