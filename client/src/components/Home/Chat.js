import React, { useState, useEffect, useContext } from 'react';
import { observer } from 'mobx-react';
import './Chat.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faCommentDots, faPaperPlane, faUsers, faUserCircle, faCircle, faExclamationCircle } from '@fortawesome/free-solid-svg-icons'
import socketIOClient from 'socket.io-client'
import axios from 'axios'
import Cookies from 'js-cookie'
import { SettingsStoreContext } from '../../stores/SettingsStore'

let socket = socketIOClient();

const Chat = observer(() => {
     const [inputValue, setInputValue] = useState('');
     const [username, setUsername] = useState(Cookies.get('username'));
     const [chat, setChat] = useState([]);
     const [onlineUsers, addOnlineUser] = useState([]);
     const [allUsers, addUser] = useState([]);
     const [typing, setTyping] = useState('');
     const [chatOpen, setChatOpen] = useState(false);
     const [messagesViewActive, setMessagesViewActive] = useState(true);
     const [usersViewActive, setUsersViewActive] = useState(false);
     const [chatNotification, setChatNotification] = useState(true)
     const SettingsStore = useContext(SettingsStoreContext);

     // let username = Cookies.get('username')

     useEffect(() => {
          socket.on('chat', (data) => {
               // set the state of the chat array with new incoming data from other sockets
               setChat([...chat, { 'handle': data.handle, 'message': data.message }])
               setTyping('');

               chatNotificationDisplay();
          })


          // Nofies user if there is someone else typing a message. disappears after seconds.
          socket.on('typing', (data) => {
               setTyping(`${data.handle} is typing...`)
               setTimeout(() => setTyping(''), 5000)
          })


          // If a user connects, calls method that gets updated version of online users
          socket.emit('onlineUsers', { user: username })
          socket.on('onlineUsers', async () => { await getAllOnlineUsers() })


          // If a user disconnects, calls method that gets updated version of online users
          socket.on('disconnect', async () => { await getAllOnlineUsers() })


          getAllUsernames()
          getAllOnlineUsers()

     }, [])

     /**
      * Retrieves array of all usernames in database. 
      * Used as a basis for showing online/offline users.
      * Filters out the user's own username.
      * 
      * @example
      *   [ {username: 'Bob'}, {username: 'Devin'} ]
      */
     async function getAllUsernames() {
          const res = await axios.post('/retrieveAllUsernames')
          console.log(res)
          const allUsernames = res.data;
          const filteredUsernames = allUsernames.filter(user => user.username !== username)
          addUser([...allUsers, ...filteredUsernames])
     }

     /**
      * Retrieves array of online users from database.
      * Also includes the unique socket id for each user.
      * The socket id will be used to delete the user from the DB when they disconnect.
      * Gets called each time a user connects or disconnects.
      * 
      * @example
      * [ {username: 'Bob', socket_id: 'Rwebsetg4823'}, {username: 'Devin', socket_id: 'waKdmS302SDs02'} ]
      */
     async function getAllOnlineUsers() {
          addOnlineUser([]);
          const res = await axios.post('/retrieveAllOnlineUsers')
          // console.log(res)
          addOnlineUser([...onlineUsers, ...res.data])
          // console.log(onlineUsers)
     }

     const updateInputValue = (e) => {
          setInputValue(e.target.value)
          // If the user deletes message before sending, 
          // this will prevent the "User is typing..." message from continually showing
          if (inputValue !== '') {
               socket.emit('typing', { handle: username })
          }
     }

     const handleClick = () => {
          socket.emit('chat', {
               handle: username,
               message: inputValue
          })
          setInputValue('');
          setUsername(username)
     }

     const handleChatView = () => {
          setChatOpen(!chatOpen);
          setChatNotification(false);
     }

     // If Message Tab is clicked and message content is not already showing
     const chatMessagesView = () => {
          if (!messagesViewActive) {
               setMessagesViewActive(true);
               setUsersViewActive(false);
          }
     }

     // If Users Tab is clicked and users are not already showing
     const chatUsersView = () => {
          if (!usersViewActive) {
               setMessagesViewActive(false);
               setUsersViewActive(true);
          }
     }


     // Notifies user if there are unread messages in chat. Gets called each time there is a new message.
     const chatNotificationDisplay = () => {
          if (chatOpen) {
               setChatNotification(false);
          } else if (!chatOpen && SettingsStore.allowChatNotifications) {
               setChatNotification(true);
          }
     }

     /**
      * Returns true if a user from allUsers is also in onlineUsers, false if not.
      * 
      * @param {string} user - Each username in allUsers array. Gets mapped at render()
      * @return {boolean} used to determine color of onlineStatus dot
      */
     const checkUserOnlineStatus = (user) => {
          return onlineUsers.some(onlineUser => onlineUser['username'] === user)
     }



     return (
          <footer id="footer">
               {!chatOpen &&
                    <div className="chat-icon" style={{ color: SettingsStore.darkMode ? '#333' : '#fff' }}
                         onClick={handleChatView}>
                         <FontAwesomeIcon icon={faCommentDots} size='2x' />
                         {chatNotification &&
                              <div className="chat-notification">
                                   <FontAwesomeIcon icon={faExclamationCircle} />
                              </div>
                         }
                    </div>
               }
               <div id="chat-container"
                    style={{ display: !chatOpen ? 'none' : '' }}>
                    <div id="tabs"
                         className="chat-tab"
                         onClick={chatMessagesView}
                         style={{ background: messagesViewActive ? '#49494d' : '#333' }}>
                         <FontAwesomeIcon icon={faCommentDots} size='2x' />
                    </div>
                    <div id="tabs"
                         className="users-tab"
                         onClick={chatUsersView}
                         style={{ background: usersViewActive ? '#49494d' : '#333' }}>
                         <FontAwesomeIcon icon={faUsers} size='2x' />
                    </div>
                    {chatOpen &&
                         <div id="tabs" className="minimize-tab"
                              onClick={handleChatView}>
                              <FontAwesomeIcon icon={faTimes} size='1x' />
                         </div>
                    }

                    <header id="chat-header"></header>

                    {chatMessagesView &&
                         <div id="chat-messages-body">
                              <section id="chat-messages-container">
                                   {chat.map((content, index) =>
                                        <div id="chat-messages-content" key={index}>
                                             <div className="message">
                                                  <div className="user-icon" style={{ color: username === content.handle ? '#2693e6' : '#f52525' }}>
                                                       <FontAwesomeIcon icon={faUserCircle} />
                                                  </div>
                                                  <div className="chat-handle" style={{ color: username === content.handle ? '#333333' : '#282828' }}>{content.handle}:</div>
                                                  <div className="chat-message">{content.message}</div>
                                             </div>
                                        </div>
                                   )}
                                   <div className="typing-message">{typing}</div>
                              </section>

                              <footer id="message-container">
                                   <textarea className="message-text"
                                        onChange={(e) => updateInputValue(e)}
                                        value={inputValue} />

                                   <button className="submit"
                                        onClick={handleClick}
                                        style={{ display: !chatOpen ? 'none' : '' }}>
                                        <FontAwesomeIcon icon={faPaperPlane} size='2x' />
                                   </button>
                              </footer>
                         </div>
                    }

                    {chatUsersView &&
                         <div id="chat-users-body">
                              <section id="chat-users-container">
                                   {allUsers.map((user, index) =>
                                        <div id="chat-user-content" key={index}>
                                             <div className="user">
                                                  {user.username}
                                             </div>
                                             <div className="online-status" style={{ color: () => checkUserOnlineStatus(user.username) ? 'green' : 'gray' }}>
                                                  <FontAwesomeIcon icon={faCircle} />
                                             </div>
                                        </div>
                                   )}
                              </section>

                              <footer id="chat-users-footer"></footer>
                         </div>
                    }
               </div>
          </footer>
     )
});

export default Chat;