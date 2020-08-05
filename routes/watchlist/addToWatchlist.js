const express = require('express')
const router = express.Router()
const withAuth = require('../../controller/middleware')
const { addToWatchlist } = require('../../model/watchlist')

router.route('/')
     .post(withAuth, (req, res) => {
          const company = req.body.company;
          const userId = req.cookies.userId;

          addToWatchlist(company, userId, () => {
               res.end()
          })
     })


module.exports = router;