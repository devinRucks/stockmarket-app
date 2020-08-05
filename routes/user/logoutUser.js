const express = require('express')
const router = express.Router()
const { blacklistToken } = require('../../model/tokenBlacklist')

router.route('/')
     .get((req, res) => {
          const token = { token: `${req.cookies.token}` }
          blacklistToken(token, () => {
               console.log("Token added to blacklist..")
               res.end()
          })
     })


module.exports = router;