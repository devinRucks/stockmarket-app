const mysql = require('mysql');

const db = mysql.createConnection({
     host: 'localhost',
     user: process.env.DB_USER,
     password: process.env.DB_PASSWORD,
     database: process.env.DB_DATABASE,
     // port: '3306'
})

exports.db = db;