import React from 'react';
import './watchlist.scss'
import * as utils from '../../../utils/styling'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios';

export default class Watchlist extends React.Component {
     constructor(props) {
          super(props);
          this.state = {
               defaultCompanies: [
                    'TSLA',
                    'AAPL',
                    'AMZN',
                    'GOOGL',
                    'GE',
                    'FB',
                    'WMT'
               ],
               myWatchlist: []
          }
     }

     componentDidMount() {
          axios.post('/retrieveWatchlist')
               .then(res => {
                    this.setState({
                         myWatchlist: [...res.data]
                    })
               })
     }

     componentDidUpdate(prevProps) {
          if (prevProps.addToWatchlist !== this.props.addToWatchlist) {
               if (!this.duplicateWatchlistCompany(this.props.addToWatchlist)) {
                    this.setState({
                         myWatchlist: [...this.state.myWatchlist, this.props.addToWatchlist]
                    }, () => console.log(this.state.myWatchlist))
               } else console.log("Company already exists")
          }
     }

     // Checks for duplicate company being added to myWatchlist. Returns TRUE if the company IS a duplicate.
     duplicateWatchlistCompany(newCompany) {
          const myWatchlist = this.state.myWatchlist;
          return myWatchlist.includes(newCompany)
     }

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