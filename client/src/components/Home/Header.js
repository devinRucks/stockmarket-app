import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios'
import Loading from '../Loading/Loading'
import Settings from './Settings'
import logo from '../../utils/title-img.png'
import { observer } from 'mobx-react';
import { faSignOutAlt, faExclamationCircle, faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { GraphInfoStoreContext } from '../../stores/GraphInfoStore'
import { UtilityStoreContext } from '../../stores/UtilityStore'
import { Link } from 'react-router-dom'
import './Header.scss';



const Header = observer(() => {
     const [inputValue, setInputValue] = useState('');
     const [postInitialRender, setPostIntialRender] = useState(false)
     const GraphInfoStore = useContext(GraphInfoStoreContext)
     const UtilityStore = useContext(UtilityStoreContext)

     useEffect(() => {
          setPostIntialRender(true)
     }, [])

     /**
	 * Gets stock data from API. If error in API call, displays error message
	 */
     const getData = () => {
          UtilityStore.setLoading(true)

          axios.post('/getData', {
               stockSymbol: GraphInfoStore.currentCompany,
               currentDate: GraphInfoStore.endDate,
               prevMonthDate: GraphInfoStore.startDate
          })
               .then(res => res.data)
               .then(data => {
                    GraphInfoStore.graphData = data.dataForGraph;
                    UtilityStore.setLoading(false)
                    UtilityStore.setErrorMsg(false)
                    setInputValue('')
                    if (data.dataForGraph.length === 0)
                         UtilityStore.setErrorMsg(true)
               })
               .catch(err => {
                    console.log(err)
                    GraphInfoStore.graphData = {};
                    UtilityStore.setLoading(false)
                    UtilityStore.setErrorMsg(true)
                    setInputValue('')
               })
     }

     /**
	 * Every time currentCompany changes, getData will be called
	 */
     useEffect(() => {
          // flag for not running on initial render
          // probably an easier way with useRef
          if (postInitialRender)
               getData();
          // eslint-disable-next-line
     }, [GraphInfoStore.currentCompany])


     /**
	 * Called when submit button is clicked
	 */
     const handleClick = () => {
          GraphInfoStore.setCurrentCompany(inputValue)
          getData();
     }

     const logout = () => {
          axios.get('/logoutUser')
     }


     return (
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
                                        onClick={logout}
                                        icon={faSignOutAlt} />
                              </div>
                         </Link>
                    </section>

                    <section id="search-container">
                         <div id="error-container">
                              {UtilityStore.errorMsg &&
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
                                   style={{ display: UtilityStore.loading ? 'none' : 'block' }}
                                   onClick={handleClick}> <FontAwesomeIcon icon={faSearch} /> </button>
                              <div className="loading-symbol">
                                   {UtilityStore.loading && <Loading type={'spokes'} color={'#FFFFFF'} />}
                              </div>
                         </div>
                    </section>
               </div>
          </header>
     )
});

export default Header;