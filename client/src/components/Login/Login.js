import React from 'react';
import './Login.scss'
import axios from 'axios';
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons'
import Loading from '../Loading/Loading'

export default class Login extends React.Component {
     constructor(props) {
          super(props);
          this.state = {
               username: '',
               password: '',
               displayError: false,
               loading: false,
               errorMsg: ''
          }
     }

     handleChange = (e) => {
          const value = e.target.value;
          this.setState({
               ...this.state, [e.target.name]: value
          })
     }

     loginUser() {
          const { username, password } = this.state;

          axios.post('/loginUser', {
               username: username,
               password: password
          })
               .then(res => {
                    if (res.status === 200) {
                         this.setState({ displayError: false, loading: false })
                         this.props.history.push('/home')
                    }
               })
               .catch(err => {
                    console.error(err)
                    this.setState({ displayError: true, errorMsg: 'Invalid Username or Password', loading: false })
                    console.log("wrong username or password")
               })
     }

     handleSubmit = async (e) => {
          e.preventDefault();
          this.setState({ loading: true })
          await this.loginUser()

     }

     render() {
          const { username, password, displayError, errorMsg, loading } = this.state

          return (
               <div id="login-container">
                    <form id="login-form" onSubmit={this.handleSubmit}>
                         <h1>Login</h1><br />

                         <input
                              className="login-input"
                              type="text"
                              name="username"
                              placeholder="Username"
                              value={username}
                              onChange={this.handleChange}
                         />
                         <input
                              className="login-input"
                              type="password"
                              name="password"
                              placeholder="Password"
                              value={password}
                              onChange={this.handleChange}
                         />

                         <div id="error-container">
                              {displayError &&
                                   <>
                                        <div className="error-icon">
                                             <FontAwesomeIcon icon={faExclamationCircle} />
                                        </div>
                                        <div className="error-msg">
                                             {errorMsg}
                                        </div>
                                   </>
                              }
                         </div>

                         <button
                              id="login-button"
                              type="submit"
                              value="Login"
                              title="Submit form"
                              className="icon-arrow-right">
                              <span>Login</span>
                              <div id="loading-symbol">
                                   {loading && <Loading type={'spokes'} color={'#333333'} />}
                              </div>
                         </button>
                         <Link to='/register'>
                              <li id="linkToRegister">Don't Have An Account? Register Here</li>
                         </Link>
                    </form>
               </div>
          )
     }
}