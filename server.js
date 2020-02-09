if (process.env.NODE_ENV !== 'production') {
     require('dotenv').config()
}

const express = require('express');
const app = express();
const socket = require('socket.io')
const path = require('path')
const jwt = require('jsonwebtoken')
const axios = require('axios')
const cookieParser = require('cookie-parser')
const helmet = require('helmet')
const { createTables } = require('./model/createTables')
const { addUser, findUser, retrieveAllUsernames } = require('./model/user')
const { addToWatchlist, retrieveWatchlist, removeFromWatchlist } = require('./model/watchlist')
const { blacklistToken, findBlacklistedToken } = require('./model/tokenBlacklist')
const utils = require('./controller/apiDataManipulation')
const withAuth = require('./controller/middleware')

app.use(express.json());
app.use(cookieParser())
app.use(helmet())

if (process.env.NODE_ENV === 'production') {

     app.use(express.static('client/build'))

     app.get('*', (req, res) => {
          res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
     })
}


app.use((req, res, next) => {
     res.header("Access-Control-Allow-Origin", "*");
     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
     next();
});

createTables();

app.post('/addToWatchlist', withAuth, (req, res) => {
     const company = req.body.company
     const userId = req.cookies.userId

     addToWatchlist(company, userId, () => {
          res.end()
     })
})

app.post('/retrieveWatchlist', (req, res) => {
     const userId = req.cookies.userId
     retrieveWatchlist(userId, (companies) => {
          res.send(companies)
     })
})

app.post('/removeFromWatchlist', withAuth, (req, res) => {
     let company = req.body.company
     const userId = req.cookies.userId

     removeFromWatchlist(company, userId, () => {
          res.sendStatus(200).end()
     })
})

app.post('/createUser', (req, res) => {
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

app.get('/logoutUser', (req, res) => {
     const token = { token: `${req.cookies.token}` }
     blacklistToken(token, () => {
          console.log("Token added to blacklist..")
          res.end()
     })
})

app.get('/retrieveAllUsernames', (req, res) => {
     retrieveAllUsernames((users) => {
          res.send(users)
     })
})


app.get('/checkToken', withAuth, (req, res) => {
     const token = req.cookies.token
     findBlacklistedToken(token, (result) => {
          if (result.length) {
               res.status(401).send("Unauthorized: Invalid Token...")
          } else {
               res.status(200).send("Authorized")
          }
     })
})

app.post('/loginUser', (req, res) => {
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

app.post('/getData', withAuth, async (req, res) => {
     let stockSymbol = req.body.stockSymbol
     let currentDate = req.body.currentDate
     let prevMonthDate = req.body.prevMonthDate

     const currentDataAPI = `https://api.worldtradingdata.com/api/v1/stock?symbol=${stockSymbol}&api_token=${process.env.STOCK_DATA_API_KEY}`
     const historicalDataAPI = `https://api.worldtradingdata.com/api/v1/history?symbol=${stockSymbol}&sort=newest&date_from=${prevMonthDate}&date_to=${currentDate}&api_token=${process.env.STOCK_DATA_API_KEY}`

     try {
          const currentDataAPIResponse = await axios.get(currentDataAPI)
          const historicalDataAPIResponse = await axios.get(historicalDataAPI)

          const historicalData = utils.historicalDataManipulation(historicalDataAPIResponse)

          res.json({
               'currentPrice': parseInt(currentDataAPIResponse.data.data[0].price),
               'avgPrice': historicalData.avgPrice,
               'graphData': historicalData.graphData
          })
     } catch (error) {
          res.status(401).send("This company does not exist")
          return
     }
})


const port = process.env.PORT || 8080;


const server = app.listen(port, () => {
     console.log(`Server started on port ${port}`)
})

// Socket Setup
let io = socket(server)


io.on('connection', (socket) => {
     console.log('Made Socket Connection...')

     socket.on('chat', (data) => {
          io.sockets.emit('chat', data)
     })

     socket.on('typing', (data) => {
          socket.broadcast.emit('typing', data)
     })

     socket.on('onlineUsers', (data) => {
          console.log(`${data.user} connected....`)

          let user = { username: data.user, id: socket.id }

          io.sockets.emit('onlineUsers', (user))
          // socket.broadcast.emit('onlineUsers', (user))

     })

     socket.on('disconnect', () => {
          console.log(`user disconnected`)
          io.sockets.emit('disconnect', (socket.id))
     })
})
