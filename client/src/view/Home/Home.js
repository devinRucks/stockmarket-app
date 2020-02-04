import React from 'react';
import './Home.scss';
import Chart from './chart/Chart'
import Watchlist from './watchlist/Watchlist'
import Chat from './chat/Chat'
import axios from 'axios'
import logo from '../imgs/title-img.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignOutAlt, faCog, faExclamationCircle, faPlusCircle, faSearch } from '@fortawesome/free-solid-svg-icons'
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
               displayModal: false,
               displayError: false,
               loading: false
          }
     }

     componentDidMount() {
          this.setState({
               currentDate: this.retrieveCurrentDate(),
               prevMonthDate: this.retrievePrevMonthDate()
          })
     }

     retrieveCurrentDate() {
          const dateObj = new Date();
          const month = dateObj.getUTCMonth() + 1; //months from 1-12
          const day = dateObj.getUTCDate();
          const year = dateObj.getUTCFullYear();
          return `${year}-${month}-${day}`
     }

     // Retrieves date of exactly 30 days ago and changes the format to fit API requirements
     // EX: 12-04-2019 to 2019-12-04
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

     // Gets stock data from API and if error, display error message
     getData() {
          axios.post('/getData', {
               stockSymbol: this.state.currentCompany,
               currentDate: this.state.currentDate,
               prevMonthDate: this.state.prevMonthDate
          })
               .then(res => res.data)
               .then(data => {
                    this.setState({
                         currentPrice: data.currentPrice,
                         avgPrice: data.avgPrice,
                         graphData: data.graphData,
                         displayError: false,
                         displayModal: true,
                         loading: false,
                         inputValue: ''
                    })
               })
               .catch(err => {
                    console.log(err)
                    this.setState({ displayError: true, inputValue: '', graphData: {}, loading: false })
               })
     }

     // On Submit Button Click
     async handleClick() {
          if (this.state.inputValue !== '') {
               this.setState({
                    currentCompany: this.state.inputValue.toUpperCase(),
                    loading: true
               }, async () => await this.getData())
          } else if (this.state.prevCompany !== this.state.currentCompany) {
               // This prevents repeat API calls for the same company by double-clicking
               await this.getData()
               this.setState({ prevCompany: this.state.currentCompany })
          } else {
               this.setState({ loading: false })
          }

     }

     // callback function for watchlist component. Updates currentCompany state depending on which item in watchlist was clicked.
     updateCurrentCompany(companyClicked) {
          this.setState({
               inputValue: '',
               currentCompany: companyClicked,
               loading: true
          }, () => {
               this.handleClick()
          })
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
          const { currentCompany, addToWatchlist, graphData, displayError, loading } = this.state;

          return (
               <div className="App">

                    <header id="header-container">
                         <div id="logo-container">
                              <img className="title-img" src={logo} alt={"title img"} height="45" width="60"></img>
                              <h1 className="logoTxt">StockData</h1>
                         </div>
                         <div id="nav-container">
                              <section id="logout-settings-container">
                                   <div className="settings-btn">
                                        <FontAwesomeIcon icon={faCog} size="1x" />
                                   </div>
                                   <Link to='/'>
                                        <div className="logout-btn">
                                             <FontAwesomeIcon
                                                  onClick={() => this.logout()}
                                                  icon={faSignOutAlt}
                                                  size="1x" />
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


                    <div id="content-container">
                         <section id="watchlist-container">
                              <Watchlist companyClick={(company) => this.updateCurrentCompany(company)} addToWatchlist={addToWatchlist} />
                         </section>

                         <section id="action-container">
                              {!displayError &&
                                   <>
                                        <div className="current-company">
                                             {currentCompany}
                                        </div>
                                        <div className="add-to-watchlist"
                                             style={{ display: currentCompany === '' ? 'none' : 'flex' }} >
                                             <div className="icon" onClick={() => this.addToWatchlist()}>
                                                  <FontAwesomeIcon icon={faPlusCircle} />
                                             </div>
                                             <div className="msg"> Add To Watchlist </div>
                                        </div>
                                   </>
                              }
                         </section>

                         <section id="chart-container">
                              <Chart data={graphData} loading={loading} />
                         </section>
                    </div>
                    <footer id="footer">
                         <Chat />
                    </footer>
               </div>
          );
     }
}