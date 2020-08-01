import React, { useEffect, useContext } from 'react';
import './watchlist.scss'
// import * as utils from '../../../utils/styling'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios';
import { observer } from 'mobx-react';
import { GraphInfoStoreContext } from '../../../stores/GraphInfoStore'
import { WatchlistStoreContext } from '../../../stores/WatchlistStore'

const Watchlist = observer(() => {
     const GraphInfoStore = useContext(GraphInfoStoreContext)
     const WatchlistStore = useContext(WatchlistStoreContext)

     // sets customWatchlist on initial render
     // gets data from server
     useEffect(() => {
          WatchlistStore.setCustomWatchlist();
     }, [])


     const defaultCompanyList = WatchlistStore.defaultWatchlist.map((companySymbol, index) => {
          return (
               <li className="default-company"
                    onClick={() => GraphInfoStore.setCurrentCompany(companySymbol)}
                    key={index}>
                    {companySymbol}
               </li>
          )
     })
     const customCompanyList = WatchlistStore.customWatchlist.map((companySymbol, index) => {
          return (
               <li id="myWatchlist-container"
                    key={index}>
                    <div
                         className="myWatchlist-company"
                         onClick={() => GraphInfoStore.setCurrentCompany(companySymbol)}>
                         {companySymbol}
                    </div>
                    <div className="trash-icon">
                         <FontAwesomeIcon
                              onClick={() => WatchlistStore.removeFromWatchlist(GraphInfoStore.currentCompany)}
                              icon={faTrash} />
                    </div>
               </li>
          )
     })

     return (
          <div id="company-container">
               <section id="default-companies">
                    <h1 className="defaultCompanies-title">Default Companies</h1>
                    <hr className="horizontal-row"></hr>
                    {defaultCompanyList}
               </section>
               <section id="watchlist">
                    <h1 className="myWatchlist-title">My Watchlist</h1>
                    <hr className="horizontal-row"></hr>
                    {customCompanyList}
               </section>
          </div>
     )
});

export default Watchlist;
