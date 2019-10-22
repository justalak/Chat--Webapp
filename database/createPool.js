var mysql = require('mysql2/promise');
var dbConfig = require('./dbconfig');
var db=mysql.createPool(dbConfig);
module.exports=db;