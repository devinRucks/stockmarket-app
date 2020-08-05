if (process.env.NODE_ENV !== 'production') {
     require('dotenv').config()
}
const express = require('express');
const app = express();
const socket = require('socket.io')
const path = require('path')
const cookieParser = require('cookie-parser')
const helmet = require('helmet')
const { createTables } = require('./model/createTables')
const { addOnlineUser, removeOnlineUser } = require('./model/chatUsers')

// Watchlist
const addToWatchlist = require('./routes/watchlist/addToWatchlist');
const getWatchlist = require('./routes/watchlist/getWatchlist');
const removeFromWatchlist = require('./routes/watchlist/removeFromWatchlist');

// User
const createUser = require('./routes/user/createUser');
const logoutUser = require('./routes/user/logoutUser');
const loginUser = require('./routes/user/loginUser');

// Chat Users
const getAllUsernames = require('./routes/chat/getAllUsernames');
const getAllOnlineUsers = require('./routes/chat/getAllOnlineUsers');

// Check Token
const checkToken = require('./routes/checkToken');

// Get Stock Data
const getData = require('./routes/getData');


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

// Watchlist
app.use('/addToWatchlist', addToWatchlist);
app.use('/getWatchlist', getWatchlist);
app.use('/removeFromWatchlist', removeFromWatchlist);

// User
app.use('/createUser', createUser);
app.use('/loginUser', loginUser);
app.use('/logoutUser', logoutUser);

// Chat Users
app.use('/getAllUsernames', getAllUsernames)
app.use('/getAllOnlineUsers', getAllOnlineUsers)

// Check Token
app.use('/checkToken', checkToken);

// Get Stock Data
app.use('/getData', getData);



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

          addOnlineUser(data.user, socket.id, (success) => {
               if (success) {
                    console.log('Online User Added...')
               }
          })

          socket.broadcast.emit('onlineUsers')
     })

     socket.on('disconnect', () => {

          removeOnlineUser(socket.id, (success) => {
               if (success) {
                    console.log('Online User Removed...')
                    io.sockets.emit('disconnect')
               } else {
                    io.sockets.emit('disconnect')
               }
          })

     })
})
