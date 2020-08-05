const { db } = require('./connection')

function getArrayofCompaniesFromResults(results) {
     let companies = []

     results.forEach(result => {
          companies.push(result.company)
     })
     return companies
}

exports.addToWatchlist = (company, userID, callback) => {

     const sql = `INSERT INTO watchlist (company, user_id) SELECT * FROM (SELECT '${company}', '${userID}') AS tmp
     WHERE NOT EXISTS (SELECT company FROM watchlist WHERE company = '${company}' AND user_id = ${userID}) LIMIT 1`

     db.query(sql, (err, result) => {
          if (err) throw err;
          else {
               callback()
          }
     })
}


exports.getWatchlist = (userID, callback) => {

     const sql = `SELECT * FROM watchlist WHERE user_id='${userID}'`

     db.query(sql, (err, result) => {
          if (err) throw err;
          else {
               callback(getArrayofCompaniesFromResults(result))
          }
     })
}

exports.removeFromWatchlist = (company, userID, callback) => {

     const sql = `DELETE FROM watchlist WHERE company='${company}' AND user_id='${userID}'`

     db.query(sql, (err, result) => {
          if (err) throw err;
          else {
               callback()
          }
     })
}