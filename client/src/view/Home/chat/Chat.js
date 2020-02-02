import React from 'react';
import './chat.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWindowMinimize, faCommentDots, faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import socketIOClient from 'socket.io-client'
import Cookies from 'js-cookie'

export default class Chart extends React.Component {
     constructor(props) {
          super(props)
          this.state = {
               inputValue: '',
               username: '',
               chat: [],
               chatOpen: false
          }
          const socket = socketIOClient()
          this.socket = socket
     }

     sendSocket() {
          this.socket.emit('chat', this.state.chat)
     }

     componentDidMount() {
          this.socket.on('chat', (data) => {
               // setState of chat array with new incoming data from other sockets
               this.setState({
                    chat: [...this.state.chat, { 'handle': data.handle, 'message': data.message }]
               })
               console.log(data)
          })
     }

     updateInputValue = (event) => {
          this.setState({
               inputValue: event.target.value
          })
     }

     handleClick() {
          const username = Cookies.get('username')

          this.socket.emit('chat', {
               handle: username,
               message: this.state.inputValue
          })

          this.setState({ inputValue: '', username: username })
     }

     handleChatView() {
          const chatOpen = this.state.chatOpen
          this.setState({ chatOpen: !chatOpen })
     }

     render() {
          const { inputValue, chat, chatOpen, username } = this.state;
          return (

               <>
                    {!chatOpen &&
                         <div className="chat-icon"
                              onClick={() => this.handleChatView()}>
                              <FontAwesomeIcon icon={faCommentDots} size='2x' />
                         </div>
                    }
                    <div id="chat-container"
                         style={{ display: !chatOpen ? 'none' : '' }}>
                         <header id="chat-header">
                              {chatOpen &&
                                   <div className="windowMinimize-icon"
                                        onClick={() => this.handleChatView()}>
                                        <FontAwesomeIcon icon={faWindowMinimize} size='2x' />
                                   </div>
                              }
                         </header>
                         <section id="chat-content-container">
                              {chat.map((content, index) =>
                                   <div id="chat-content" key={index}>
                                        <div className="message">
                                             <div className="chat-handle" style={{ color: username === content.handle ? '#333333' : '#282828' }}>{content.handle}:</div>
                                             <div className="chat-message">{content.message}</div>
                                        </div>
                                   </div>)}
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