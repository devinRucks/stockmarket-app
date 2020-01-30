const { db } = require('./connection')

exports.blacklistToken = (token, callback) => {

     const sql = 'INSERT INTO blacklistedTokens SET ?'

     db.query(sql, token, (err, result) => {
          if (err) throw err;
          else {
               callback()
          }
     })
}

exports.findBlacklistedToken = (token, callback) => {

     const sql = `SELECT * FROM blacklistedTokens WHERE token='${token}'`

     db.query(sql, (err, result) => {
          if (err) throw err;
          else {
               callback(result)
          }
     })
}