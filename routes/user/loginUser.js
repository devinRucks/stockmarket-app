const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const { findUser } = require('../../model/user')

router.route('/')
     .post((req, res) => {
          const { username, password } = req.body;

          findUser(username, password, (user, result) => {
               console.log(user)
               if (user) {
                    const userId = result[0].id
                    const username = result[0].username
                    console.log("Successfully Logged In!")

                    const payload = { username }

                    const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '40m' })

                    res.cookie('token', token, { httpOnly: true }).cookie('userId', `${userId}`).cookie('username', `${username}`).sendStatus(200)
               } else {
                    console.log("Incorrect Username/Password...")
                    res.status(401).send("Incorrect Username/Password...")
               }
          })
     })


module.exports = router;