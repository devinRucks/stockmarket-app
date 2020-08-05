const express = require('express')
const router = express.Router()
const withAuth = require('../../controller/middleware')
const { getWatchlist } = require('../../model/watchlist')

router.route('/')
     .post(withAuth, (req, res) => {
          const userId = req.cookies.userId

          getWatchlist(userId, (companies) => {
               res.send(companies)
          })
     })


module.exports = router;