import React from 'react';
import './chat.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faCommentDots, faPaperPlane, faUsers, faUserCircle, faCircle } from '@fortawesome/free-solid-svg-icons'
import socketIOClient from 'socket.io-client'
import axios from 'axios'
import Cookies from 'js-cookie'

export default class Chat extends React.Component {
     constructor(props) {
          super(props)
          this.state = {
               inputValue: '',
               username: '',
               chat: [],
               onlineUsers: [],
               allUsers: [],
               typing: '',
               chatOpen: false,
               chatMessagesView: true,
               chatUsersView: false
          }
          this.socket = socketIOClient()
          this.username = Cookies.get('username')
     }

     async componentDidMount() {
          this.socket.on('chat', (data) => {
               // setState of chat array with new incoming data from other sockets
               this.setState({
                    chat: [...this.state.chat, { 'handle': data.handle, 'message': data.message }],
                    typing: ''
               })
          })

          this.socket.on('typing', (data) => {
               this.setState({ typing: `${data.handle} is typing... ` })
               setTimeout(() => this.setState({ typing: '' }), 5000)
          })

          // Updates the state of onlineUsers if a user connects
          this.socket.emit('onlineUsers', { user: this.username })
          this.socket.on('onlineUsers', (data) => {
               this.setState({
                    onlineUsers: [...this.state.onlineUsers, data]
               })
               // onlineUsers: [{username: "Demo", id: "wenunecONSnksjd"}, {username: "Tyler", id: "wenunecONSnksjd"}]
          })

          // Updates the state of onlineUsers if a user disconnects
          this.socket.on('disconnect', (data) => {
               const onlineUsersCopy = [...this.state.onlineUsers]
               onlineUsersCopy.forEach((user, index) => {
                    if (user.id === data) {
                         onlineUsersCopy.splice(index, 1)
                         this.setState({ onlineUsers: onlineUsersCopy })
                    }
               })
          })

          await this.getAllUsernames()
     }

     async getAllUsernames() {
          axios.post('/retrieveAllUsernames')
               .then(res => {
                    console.log(res.data)
                    this.setState({
                         allUsers: [...this.state.allUsers, ...res.data]
                    })
                    // allUsers: [{username: "Demo"}, {username: "Tyler"}]
               })
               .catch((err) => {
                    console.log(err)
               })
     }



     updateInputValue = (event) => {
          this.setState({ inputValue: event.target.value })
          // If the user deletes message before sending, this will prevent the "User is typing..." message from continually showing
          if (this.state.inputValue !== '') {
               this.socket.emit('typing', { handle: this.username })
          }
     }

     handleClick() {
          this.socket.emit('chat', {
               handle: this.username,
               message: this.state.inputValue
          })
          this.setState({ inputValue: '', username: this.username })
     }

     handleChatView() {
          const chatOpen = this.state.chatOpen
          this.setState({ chatOpen: !chatOpen })
     }

     chatMessagesView() {
          // If Message Tab is clicked and message content is not already showing
          if (!this.state.chatMessagesView) {
               this.setState({ chatMessagesView: true, chatUsersView: false })
          }
     }

     chatUsersView() {
          // If Users Tab is clicked and users are not already showing
          if (!this.state.chatUsersView) {
               this.setState({ chatMessagesView: false, chatUsersView: true })
          }
     }

     // Returns true if a user (from allUsers) is also in onlineUsers.
     checkUserOnlineStatus(user) {
          const { onlineUsers } = this.state;
          return onlineUsers.some(onlineUser => onlineUser['username'] === user)
     }

     render() {
          const { darkMode } = this.props;
          const { inputValue, chat, allUsers, chatOpen, username, typing, chatMessagesView, chatUsersView } = this.state;
          return (

               <>
                    {!chatOpen &&
                         <div className="chat-icon" style={{ color: darkMode ? '#333' : '#fff' }}
                              onClick={() => this.handleChatView()}>
                              <FontAwesomeIcon icon={faCommentDots} size='2x' />
                         </div>
                    }
                    <div id="chat-container"
                         style={{ display: !chatOpen ? 'none' : '' }}>
                         <div id="tabs"
                              className="chat-tab"
                              onClick={() => this.chatMessagesView()}
                              style={{ background: chatMessagesView ? '#49494d' : '#333' }}>
                              <FontAwesomeIcon icon={faCommentDots} size='2x' />
                         </div>
                         <div id="tabs"
                              className="users-tab"
                              onClick={() => this.chatUsersView()}
                              style={{ background: chatUsersView ? '#49494d' : '#333' }}>
                              <FontAwesomeIcon icon={faUsers} size='2x' />
                         </div>
                         {chatOpen &&
                              <div id="tabs" className="minimize-tab"
                                   onClick={() => this.handleChatView()}>
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
                                             onChange={(event) => this.updateInputValue(event)}
                                             value={inputValue} />

                                        <button className="submit"
                                             onClick={() => this.handleClick()}
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
                                                  <div className="online-status" style={{ color: this.checkUserOnlineStatus(user.username) ? 'green' : 'gray' }}>
                                                       <FontAwesomeIcon icon={faCircle} />
                                                  </div>
                                             </div>
                                        )}
                                   </section>

                                   <footer id="chat-users-footer"></footer>
                              </div>
                         }
                    </div>
               </>
          )
     }
}