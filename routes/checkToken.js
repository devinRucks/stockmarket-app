const express = require('express')
const router = express.Router()
const withAuth = require('../../controller/middleware')
const { findBlacklistedToken } = require('./model/tokenBlacklist')

router.route('/')
     .get(withAuth, (req, res) => {
          const token = req.cookies.token

          findBlacklistedToken(token, (result) => {
               if (result.length) {
                    res.status(401).send("Unauthorized: Invalid Token...")
               } else {
                    res.status(200).send("Authorized")
               }
          })
     })


module.exports = router;