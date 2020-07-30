import React, { useEffect, useState } from 'react';
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
import { observer } from 'mobx-react-lite';
import { useContext } from 'react';
import { GraphInfoStoreContext } from '../../stores/GraphInfoStore'
import { AccessoryStoreContext } from '../../stores/AccessoryStore'


const Home = observer(() => {
     const [inputValue, setInputValue] = useState('');
     const [currentCompany, setCurrentCompany] = useState('');
     // const [addToWatchlist, setAddToWatchlist] = useState('');

     const GraphInfoStore = useContext(GraphInfoStoreContext);
     const AccessoryStore = useContext(AccessoryStoreContext);

     useEffect(() => {
          GraphInfoStore.currentDate = retrieveCurrentDate();
          GraphInfoStore.prevMonthDate = retrievePrevMonthDate();
     });

     /**
      * Retrieves current date.
      * @example 
      *   2019-12-04
      */
     const retrieveCurrentDate = () => {
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
     const retrievePrevMonthDate = () => {
          let prevMonth = moment().subtract(30, 'days').calendar()
          const prevMonthDate = prevMonth.replace(/\//g, '-');

          let numbers = prevMonthDate.substring(0, 5);
          return prevMonthDate.substring(6) + '-' + numbers
     }


     /**
      * Gets stock data from API. If error in API call, displays error message
      */
     const getData = () => {

          AccessoryStore.loading = true;

          axios.post('/getData', {
               stockSymbol: currentCompany,
               currentDate: GraphInfoStore.currentDate,
               prevMonthDate: GraphInfoStore.prevMonthDate
          })
               .then(res => res.data)
               .then(data => {
                    GraphInfoStore.graphData = data.dataForGraph;
                    AccessoryStore.displayError = false;
                    AccessoryStore.loading = false;
                    setInputValue('')
               })
               .catch(err => {
                    console.log(err)
                    GraphInfoStore.graphData = {};
                    AccessoryStore.displayError = true;
                    AccessoryStore.loading = false;
                    setInputValue('')
               })
     }

     // On Submit Button 
     const handleClick = () => {
          // Checks to make sure user has typed something in search field.
          if (this.state.inputValue !== '') {
               setCurrentCompany(inputValue.toUpperCase());
               getData();
          }

     }

     /**
      * Callback function from Watchlist component. 
      * @param {string} companyClicked - company that was clicked
      */
     // const updateCurrentCompany = (companyClicked) => {
     //      this.setState({
     //           inputValue: '',
     //           currentCompany: companyClicked,
     //           loading: true
     //      }, () => {
     //           this.handleClick()
     //      })
     // }


     // // called when the add to watchlist button is clicked
     // const addToWatchlist = () => {
     //      this.setState({
     //           addToWatchlist: this.state.currentCompany
     //      }, () => {
     //           axios.post('/addToWatchlist', { company: this.state.currentCompany })
     //      })
     // }

     const logout = () => {
          axios.get('/logoutUser')
     }

     return (
          <div className="App">

               <header id="header-container">

                    <div id="logo-container">
                         <img className="title-img" src={logo} alt={"title img"} height="45" width="60"></img>
                         <h1 className="logoTxt">StockData</h1>
                    </div>

                    <div id="nav-container">
                         <section id="logout-settings-container">
                              <Settings />
                              <Link to='/'>
                                   <div className="logout-btn">
                                        <FontAwesomeIcon
                                             onClick={() => logout()}
                                             icon={faSignOutAlt} />
                                   </div>
                              </Link>
                         </section>

                         <section id="search-container">
                              <div id="error-container">
                                   {AccessoryStore.displayError &&
                                        <>
                                             <div className="error-icon">
                                                  <FontAwesomeIcon icon={faExclamationCircle} />
                                             </div>
                                             <div className="error-msg">Invalid Company</div>
                                        </>
                                   }
                              </div>

                              <input className="searchTxt"
                                   onChange={e => setInputValue(e.target.value)}
                                   value={inputValue} />

                              <div id="submit-loading-container">
                                   <button className="submit"
                                        style={{ display: AccessoryStore.loading ? 'none' : 'block' }}
                                        onClick={handleClick()}> <FontAwesomeIcon icon={faSearch} /> </button>
                                   <div className="loading-symbol">
                                        {AccessoryStore.loading && <Loading type={'spokes'} color={'#FFFFFF'} />}
                                   </div>
                              </div>
                         </section>
                    </div>
               </header>

               <div id="content-container">
                    <section id="watchlist-container">
                         <Watchlist />
                    </section>

                    <section id="action-container">
                         {!AccessoryStore.displayError &&
                              <>
                                   <div className="current-company">
                                        {currentCompany}
                                   </div>
                                   <div className="add-to-watchlist">
                                        <div className="icon" onClick={addToWatchlist()}>
                                             <FontAwesomeIcon icon={faPlusCircle} />
                                        </div>
                                        <div className="msg"> Add To Watchlist </div>
                                   </div>
                              </>
                         }
                    </section>

                    <section id="chart-container">
                         <Chart data={GraphInfoStore.graphData} loading={AccessoryStore.loading} />
                    </section>
               </div>
               <footer id="footer">
                    <Chat allowChatNotifications={AccessoryStore.chatNotifications} />
               </footer>
          </div>
     );
});

export default Home;