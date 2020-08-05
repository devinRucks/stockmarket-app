const express = require('express')
const router = express.Router()
const { getAllUsernames } = require('../../model/chatUsers')

router.route('/')
     .post((req, res) => {
          getAllUsernames((users) => {
               res.json(users)
          })
     })


module.exports = router;