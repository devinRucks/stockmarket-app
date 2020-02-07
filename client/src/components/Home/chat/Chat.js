import React from 'react';
import './chat.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faCommentDots, faPaperPlane, faUsers, faUserCircle } from '@fortawesome/free-solid-svg-icons'
import socketIOClient from 'socket.io-client'
import Cookies from 'js-cookie'

export default class Chart extends React.Component {
     constructor(props) {
          super(props)
          this.state = {
               inputValue: '',
               username: '',
               chat: [],
               onlineUsers: [],
               typing: '',
               chatOpen: false
          }
          this.socket = socketIOClient()
          this.username = Cookies.get('username')
     }

     componentDidMount() {
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

          this.socket.emit('onlineUsers', { user: this.username })
          this.socket.on('onlineUsers', (data) => {
               this.setState({
                    onlineUsers: [...this.state.onlineUsers, data]
               }, () => console.log(this.state.onlineUsers))
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

     render() {
          const { darkMode } = this.props;
          const { inputValue, chat, chatOpen, username, typing } = this.state;
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
                         <div id="tabs" className="chat-tab">
                              <FontAwesomeIcon icon={faCommentDots} size='2x' />
                         </div>
                         <div id="tabs" className="users-tab">
                              <FontAwesomeIcon icon={faUsers} size='2x' />
                         </div>
                         {chatOpen &&
                              <div id="tabs" className="minimize-tab"
                                   onClick={() => this.handleChatView()}>
                                   <FontAwesomeIcon icon={faTimes} size='1x' />
                              </div>
                         }

                         <header id="chat-header"></header>

                         <section id="chat-content-container">
                              {chat.map((content, index) =>
                                   <div id="chat-content" key={index}>
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

                         <section id="message-container">
                              <textarea className="message-text"
                                   onChange={(event) => this.updateInputValue(event)}
                                   value={inputValue} />

                              <button className="submit"
                                   onClick={() => this.handleClick()}
                                   style={{ display: !chatOpen ? 'none' : '' }}>
                                   <FontAwesomeIcon icon={faPaperPlane} size='2x' />
                              </button>
                         </section>
                    </div>
               </>
          )
     }
}