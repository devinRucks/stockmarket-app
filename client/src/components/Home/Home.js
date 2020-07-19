import React from 'react';
import './Home.scss';
import Chart from './chart/Chart'
import Watchlist from './watchlist/Watchlist'
import Chat from './chat/Chat'
import Settings from './settings/Settings'
import axios from 'axios'
import logo from '../../utils/title-img.png'
import * as utils from '../../utils/styling'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignOutAlt, faExclamationCircle, faPlusCircle, faSearch } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import moment from 'moment'
import Loading from '../Loading/Loading'


export default class App extends React.Component {
     constructor(props) {
          super(props);
          this.state = {
               inputValue: '',
               currentCompany: '',
               prevCompany: '',
               addToWatchlist: '',
               prevMonthDate: '',
               currentDate: '',
               graphData: {},
               displayError: false,
               loading: false,
               darkMode: false,
               chatNotifications: true
          }
     }

     componentDidMount() {
          this.setState({
               currentDate: this.retrieveCurrentDate(),
               prevMonthDate: this.retrievePrevMonthDate()
          })
     }

     /**
      * Retrieves current date.
      * @example 
      *   2019-12-04
      */
     retrieveCurrentDate() {
          const dateObj = new Date();
          const month = dateObj.getUTCMonth() + 1; //months from 1-12
          const day = dateObj.getUTCDate();
          const year = dateObj.getUTCFullYear();
          return `${year}-${month}-${day}`
     }

     /**
      * Retrieves date of 30 days from current date. Then formats to fit API requirements.
      * @example 
      *   12-04-2019 -> 2019-12-04
      */
     retrievePrevMonthDate() {
          let prevMonth = moment().subtract(30, 'days').calendar()
          const prevMonthDate = prevMonth.replace(/\//g, '-');

          let numbers = prevMonthDate.substring(0, 5);
          return prevMonthDate.substring(6) + '-' + numbers
     }

     updateInputValue = (event) => {
          this.setState({
               inputValue: event.target.value
          })
     }


     /**
      * Gets stock data from API. If error in API call, displays error message
      */
     getData() {
          axios.post('/getData', {
               stockSymbol: this.state.currentCompany,
               currentDate: this.state.currentDate,
               prevMonthDate: this.state.prevMonthDate
          })
               .then(res => res.data)
               .then(data => {
                    this.setState({
                         graphData: data.dataForGraph,
                         displayError: false,
                         loading: false,
                         inputValue: ''
                    })
               })
               .catch(err => {
                    console.log(err)
                    this.setState({ displayError: true, inputValue: '', graphData: {}, loading: false })
               })
     }

     // On Submit Button 
     async handleClick() {
          // Checks to make sure user has typed something in search field.
          if (this.state.inputValue !== '') {
               this.setState({
                    currentCompany: this.state.inputValue.toUpperCase(),
                    loading: true
               }, async () => await this.getData())
          } else if (this.state.prevCompany !== this.state.currentCompany) {
               // This prevents repeat API calls for the same company by double-clicking.
               // prevCompany is always one company behind, which allows checking for repeat clicks.
               await this.getData()
               this.setState({ prevCompany: this.state.currentCompany })
          } else {
               this.setState({ loading: false })
          }

     }


     /**
      * Callback function from Watchlist component. 
      * @param {string} companyClicked - company that was clicked
      */
     updateCurrentCompany(companyClicked) {
          this.setState({
               inputValue: '',
               currentCompany: companyClicked,
               loading: true
          }, () => {
               this.handleClick()
          })
     }

     /**
      * Callback function from Settings component
      * @param {boolean} state - true if DarkMode setting is on, false if not. Default is false.
      */
     setDarkMode(state) {
          this.setState({ darkMode: state })
     }

     /**
      * Callback function from Settings component
      * @param {boolean} state - true if ChatNotifications are turned on, false if not. Default is true.
      */
     setChatNotifications(state) {
          this.setState({ chatNotifications: state })
     }

     // called when the add to watchlist button is clicked
     addToWatchlist() {
          this.setState({
               addToWatchlist: this.state.currentCompany
          }, () => {
               axios.post('/addToWatchlist', { company: this.state.currentCompany })
          })
     }

     logout() {
          axios.get('/logoutUser')
     }

     render() {
          const { currentCompany, addToWatchlist, graphData, displayError, loading, darkMode, chatNotifications } = this.state;

          return (
               <div className="App" style={darkMode ? utils.generalDarkMode : utils.generalLightMode}>

                    <header id="header-container" style={darkMode ? utils.headerAndFooterDarkMode : utils.headerAndFooterLightMode}>

                         <div id="logo-container">
                              <img className="title-img" src={logo} alt={"title img"} height="45" width="60"></img>
                              <h1 className="logoTxt">StockData</h1>
                         </div>

                         <div id="nav-container">
                              <section id="logout-settings-container">
                                   <Settings
                                        darkMode={(state) => this.setDarkMode(state)}
                                        chatNotifications={(state) => this.setChatNotifications(state)}
                                   />
                                   <Link to='/'>
                                        <div className="logout-btn" style={darkMode ? utils.headerAndFooterDarkMode : utils.headerAndFooterLightMode}>
                                             <FontAwesomeIcon
                                                  onClick={() => this.logout()}
                                                  icon={faSignOutAlt} />
                                        </div>
                                   </Link>
                              </section>

                              <section id="search-container">
                                   <div id="error-container">
                                        {displayError &&
                                             <>
                                                  <div className="error-icon">
                                                       <FontAwesomeIcon icon={faExclamationCircle} />
                                                  </div>
                                                  <div className="error-msg">Invalid Company</div>
                                             </>
                                        }
                                   </div>

                                   <input className="searchTxt"
                                        onChange={(event) => this.updateInputValue(event)}
                                        value={this.state.inputValue} />

                                   <div id="submit-loading-container">
                                        <button className="submit"
                                             style={{ display: loading ? 'none' : 'block' }}
                                             onClick={() => this.handleClick()}> <FontAwesomeIcon icon={faSearch} /> </button>
                                        <div className="loading-symbol">
                                             {loading && <Loading type={'spokes'} color={'#FFFFFF'} />}
                                        </div>
                                   </div>
                              </section>
                         </div>
                    </header>

                    <div id="content-container" style={darkMode ? utils.generalDarkMode : utils.generalLightMode}>
                         <section id="watchlist-container" style={darkMode ? utils.generalDarkMode : utils.generalLightMode}>
                              <Watchlist companyClick={(company) => this.updateCurrentCompany(company)} addToWatchlist={addToWatchlist} darkMode={darkMode} />
                         </section>

                         <section id="action-container">
                              {!displayError &&
                                   <>
                                        <div className="current-company"
                                             style={darkMode ? utils.darkModeFontColor : utils.lightModeFontColor}>
                                             {currentCompany}
                                        </div>
                                        <div className="add-to-watchlist"
                                             style={currentCompany === '' ? { display: 'none' } : { display: 'flex' } && darkMode ? utils.darkModeFontColor : utils.lightModeFontColor}>
                                             <div className="icon" onClick={() => this.addToWatchlist()}>
                                                  <FontAwesomeIcon icon={faPlusCircle} />
                                             </div>
                                             <div className="msg"> Add To Watchlist </div>
                                        </div>
                                   </>
                              }
                         </section>

                         <section id="chart-container">
                              <Chart data={graphData} loading={loading} darkMode={darkMode} />
                         </section>
                    </div>
                    <footer id="footer" style={darkMode ? utils.headerAndFooterDarkMode : utils.headerAndFooterLightMode}>
                         <Chat allowChatNotifications={chatNotifications} darkMode={darkMode} />
                    </footer>
               </div>
          );
     }
}