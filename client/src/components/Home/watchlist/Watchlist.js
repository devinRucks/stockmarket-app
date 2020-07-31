import React from 'react';
import './watchlist.scss'
import * as utils from '../../../utils/styling'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios';
import { observer, inject } from 'mobx-react';

const Watchlist = inject('WatchlistStore')(observer((props) => {
     const { WatchlistStore } = props;
     let postInitialRender = false;

     // sets customWatchlist on initial render
     // gets data from server
     useEffect(() => {
          WatchlistStore.getCurrentWatchlist();
          postInitialRender = true;
     }, [])

     // Updates customWatchlist when addToWatchlist is clicked. 
     // This is separate from the useEffect above because I dont want to have to retrieve 
     // data from server on every time an item is added to the watchlist. 
     // It's faster to just render the html
     // NOTE: I'm still sending data TO server, just not retrieving it here..
     useEffect(() => {
          // Only want this function to run after inital render.
          if (postInitialRender) {

          }
     })


     /**
      * Removes company from DB when trash icon is clicked.
      * Removes from markup by filtering out that company from the state of myWatchlist array.
      * 
      * @param {string} company - 'TSLA' 
      */
     removeItem(company) {
          axios.post('/removeFromWatchlist', { company })
               .then(res => {
                    if (res.status === 200) {
                         this.setState({
                              myWatchlist: this.state.myWatchlist.filter(companySymbol => companySymbol !== company)
                         })
                    }
               })
     }


     render() {
          const { darkMode } = this.props;
          const { defaultCompanies, myWatchlist } = this.state;

          const defaultCompanyList = defaultCompanies.map((companySymbol, index) => {
               return (
                    <li className="default-company"
                         style={darkMode ? utils.darkModeBorder : utils.lightModeBorder}
                         onClick={() => this.props.companyClick(companySymbol)}
                         key={index}>
                         {companySymbol}
                    </li>
               )
          })
          const watchlist = myWatchlist.map((companySymbol, index) => {
               return (
                    <li id="myWatchlist-container"
                         key={index}>
                         <div
                              className="myWatchlist-company"
                              style={darkMode ? utils.darkModeBorder : utils.lightModeBorder}
                              onClick={() => this.props.companyClick(companySymbol)}>
                              {companySymbol}
                         </div>
                         <div className="trash-icon">
                              <FontAwesomeIcon
                                   onClick={() => this.removeItem(companySymbol)}
                                   icon={faTrash} />
                         </div>
                    </li>
               )
          })

          return (
               <div id="company-container" style={darkMode ? utils.generalDarkMode : utils.generalLightMode}>
                    <section id="default-companies">
                         <h1 className="defaultCompanies-title">Default Companies</h1>
                         <hr className="horizontal-row"></hr>
                         {defaultCompanyList}
                    </section>
                    <section id="watchlist">
                         <h1 className="myWatchlist-title">My Watchlist</h1>
                         <hr className="horizontal-row"></hr>
                         {watchlist}
                    </section>
               </div>
          )
     }
}