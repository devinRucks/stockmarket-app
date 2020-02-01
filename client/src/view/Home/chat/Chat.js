import React from 'react';
import './chat.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWindowMinimize, faCommentDots } from '@fortawesome/free-solid-svg-icons'
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
          // const socket = socketIOClient('http://localhost:8080')
          let socket = socketIOClient.connect('http://localhost:8080', { transports: ['websocket'] });
          this.socket = socket
     }

     sendSocket() {
          // const socket = socketIOClient('http://localhost:8080')
          this.socket.emit('chat', this.state.chat)
     }

     componentDidMount() {
          // const socket = socketIOClient('http://localhost:8080')
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
          // const socket = socketIOClient('http://localhost:8080')
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
          // If content.handle === local username, set color to red, else: set color to blue
          const { inputValue, chat, chatOpen, username } = this.state;
          return (

               <>
                    {!chatOpen &&
                         <div className="chat-icon windowMaximize-icon"
                              onClick={() => this.handleChatView()}>
                              <FontAwesomeIcon icon={faCommentDots} size='2x' />
                         </div>
                    }
                    <div id="chat-container"
                         style={{ display: !chatOpen ? 'none' : '' }}>
                         <header id="chat-header">
                              {chatOpen &&
                                   <div className="chat-icon windowMinimize-icon"
                                        onClick={() => this.handleChatView()}>
                                        <FontAwesomeIcon icon={faWindowMinimize} size='2x' />
                                   </div>
                              }
                         </header>
                         <section id="chat-content-container">
                              {chat.map((content, index) =>
                                   <div id="chat-content" key={index}>
                                        <div className="chat-handle" style={{ color: username === content.handle ? '#19bd1b' : '#009dff' }}>{content.handle}:</div>
                                        <div className="chat-message">{content.message}</div>
                                   </div>)}
                         </section>
                         <section id="message-container">
                              <input className="message-text"
                                   onChange={(event) => this.updateInputValue(event)}
                                   value={inputValue} />

                              <button className="submit"
                                   onClick={() => this.handleClick()}
                                   style={{ display: !chatOpen ? 'none' : '' }}> Submit </button>
                         </section>
                    </div>
               </>
          )
     }
}