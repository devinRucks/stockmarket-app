const mysql = require('mysql');

const db = mysql.createConnection({
     host: 'us-cdbr-iron-east-04.cleardb.net',
     user: 'b426661e79eb6a',
     password: '17874281',
     database: 'heroku_7dccf4774d79e42',
     // port: '3306'
})

exports.db = db;