const { db } = require('./connection')
const bcrypt = require('bcrypt')

exports.addUser = (username, password, email, callback) => {

     const sql = 'INSERT INTO users SET ?'

     bcrypt.hash(password, 12, (err, hash) => {
          let userInfo = { username: `${username}`, password: `${hash}`, email: `${email}` }

          db.query(sql, userInfo, (err, result) => {
               if (err) {
                    callback(false) // Username already exists
               }
               else if (result.length) {
                    callback(true) // Username does not exist, create new user
               }
          })
     });
}


exports.findUser = (username, password, callback) => {

     const sql = `SELECT id, username, password FROM users WHERE username='${username}'`;

     db.query(sql, (err, result) => {
          if (err) throw err;
          // If username was found, test to see if password matched
          else if (result.length) {
               bcrypt.compare(password, result[0].password, (err, res) => {
                    if (res) {
                         callback(true, result) // If the password matched, send the user obj 
                    } else {
                         console.log("password did not match")
                         callback(false) // If the password did not match, send false
                    }
               });
          } else {
               console.log("username did not match")
               callback(false) // If username did not match, send false
          }
     })
}