import React from 'react';
import './Register.scss'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExclamationCircle, faCheckCircle } from '@fortawesome/free-solid-svg-icons'
import Loading from '../Loading/Loading'

export default class Regsiter extends React.Component {
     constructor(props) {
          super(props);
          this.state = {
               username: '',
               email: '',
               password: '',
               displayErrorMsg: false,
               displaySuccessMsg: false,
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

     /**
      * Calls /createRoute route on server.
      * If success, display success message.
      * If error, display error message.
      */
     createUser() {
          const { username, password, email } = this.state
          axios.post('/createUser', {
               username: username,
               password: password,
               email: email
          })
               .then(res => {
                    if (res.status === 200) {
                         this.setState({ displayErrorMsg: false, displaySuccessMsg: true, loading: false })
                    }
               })
               .catch(err => {
                    console.error(err)
                    this.setState({ displayErrorMsg: true, displaySuccessMsg: false, errorMsg: 'Username already exists', loading: false })
                    console.log("Username already exists")
               })
     }

     handleSubmit = async (e) => {
          e.preventDefault()
          this.setState({ loading: true })
          this.createUser()
     }

     render() {
          const { username, password, email, displayErrorMsg, displaySuccessMsg, errorMsg, loading } = this.state
          return (
               <div id="register-container">
                    <form id="register-form" onSubmit={this.handleSubmit}>
                         <h1>Regsiter</h1><br />

                         <input
                              className="register-input"
                              type="text"
                              name="username"
                              placeholder="Username"
                              value={username}
                              onChange={this.handleChange}
                         />
                         <input
                              className="register-input"
                              type="email"
                              name="email"
                              placeholder="Email address"
                              required value={email}
                              onChange={this.handleChange}
                         />
                         <input
                              className="register-input"
                              type="password"
                              name="password"
                              placeholder="Password"
                              value={password}
                              onChange={this.handleChange}
                         />

                         <div id="error-success-container">
                              {displayErrorMsg &&
                                   <>
                                        <div className="error-icon">
                                             <FontAwesomeIcon icon={faExclamationCircle} />
                                        </div>
                                        <div className="error-msg">
                                             {errorMsg}
                                        </div>
                                   </>
                              }
                              {displaySuccessMsg &&
                                   <>
                                        <div className="success-msg">
                                             User Successfully Registered!
                                        </div>
                                        <div className="success-icon">
                                             <FontAwesomeIcon icon={faCheckCircle} />
                                        </div>
                                   </>
                              }

                         </div>

                         <button
                              id="register-button"
                              type="submit"
                              value="Submit"
                              title="Submit form"
                              className="icon-arrow-right">
                              <span>Submit</span>
                              <div id="loading-symbol">
                                   {loading && <Loading type={'spokes'} color={'#333333'} />}
                              </div>
                         </button>
                         <Link to='/'>
                              <li id="linkToLogin">Already Have An Account? Login Here</li>
                         </Link>
                    </form>
               </div>
          )
     }
}

