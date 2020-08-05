const express = require('express')
const router = express.Router()
const { addUser } = require('../../model/user')

router.route('/')
     .post((req, res) => {
          const { username, password, email } = req.body

          addUser(username, password, email, (success) => {
               if (success) {
                    console.log('User Added...')
                    res.sendStatus(200)
               } else {
                    res.sendStatus(401)
               }
          })
     })


module.exports = router;