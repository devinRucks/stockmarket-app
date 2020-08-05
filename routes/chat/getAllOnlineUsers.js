const express = require('express')
const router = express.Router()
const { getAllOnlineUsers } = require('../../model/chatUsers')

router.route('/')
     .post((req, res) => {
          getAllOnlineUsers((users) => {
               res.json(users)
          })
     })


module.exports = router;