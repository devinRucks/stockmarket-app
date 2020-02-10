const { db } = require('./connection')

exports.addOnlineUser = (username, socket_id, callback) => {
     const sql = 'INSERT INTO onlineUsers SET ?'

     const userInfo = { username: `${username}`, socket_id: `${socket_id}` }

     db.query(sql, userInfo, (err, result) => {
          if (err) {
               callback(false)
          }
          else if (result.length) {
               callback(true)
          }
     })
}

exports.retrieveAllOnlineUsers = (callback) => {
     const sql = 'SELECT username FROM onlineUsers'

     db.query(sql, (err, result) => {
          if (err) throw err;
          callback(result)
     })
}

exports.removeOnlineUser = (socket_id, callback) => {
     const sql = `DELETE FROM onlineUsers WHERE socket_id='${socket_id}'`;

     db.query(sql, (err, result) => {
          if (err) {
               callback(false)
          }
          else if (result.length) {
               console.log(result)
               callback(true)
          }
     })
}