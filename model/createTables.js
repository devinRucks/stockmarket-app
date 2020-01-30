const { db } = require('./connection')

exports.createTables = () => {

     db.connect((err) => {
          if (err) throw err
          console.log('MySql Connected...')

          const watchlist = 'CREATE TABLE if not exists watchlist (id INT AUTO_INCREMENT PRIMARY KEY, company VARCHAR(255), user_id VARCHAR(255))'

          db.query(watchlist, (err, result) => {
               if (err) throw err;
          })

          const users = 'CREATE TABLE if not exists users (id INT AUTO_INCREMENT PRIMARY KEY, username VARCHAR(255) UNIQUE, password VARCHAR(255), email VARCHAR(255))'

          db.query(users, (err, result) => {
               if (err) throw err;
          })

          const blacklistedTokens = 'CREATE TABLE if not exists blacklistedTokens (id INT AUTO_INCREMENT PRIMARY KEY, token VARCHAR(255))'

          db.query(blacklistedTokens, (err, result) => {
               if (err) throw err;
          })
     })
}
