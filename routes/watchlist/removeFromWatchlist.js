const express = require('express')
const router = express.Router()
const withAuth = require('../../controller/middleware')
const { removeFromWatchlist } = require('../../model/watchlist')

router.route('/')
     .post(withAuth, (req, res) => {
          let company = req.body.company
          const userId = req.cookies.userId

          removeFromWatchlist(company, userId, () => {
               res.sendStatus(200).end()
          })
     })


module.exports = router;