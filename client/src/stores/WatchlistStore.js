import { observable, action } from 'mobx'
import axios from 'axios';
import { createContext } from 'react';


class WatchlistStore {
     @observable defaultWatchlist = [
          'TSLA',
          'AAPL',
          'AMZN',
          'GOOGL',
          'GE',
          'FB',
     ];
     @observable customWatchlist = [];

     /**
      * Called when add to watchlist button is clicked. (From <Home/>)
      * If company doesn't already exist, add to customWatchlist and store in DB
      * 
      * @param {string} currentCompany 
      */
     @action
     addToWatchlist = (currentCompany) => {
          if (!this.companyExists(currentCompany)) {
               // if company does not already exist, add it to custom watchlist
               this.customWatchlist.push(currentCompany)

               // send the company to the server which will eventually be stored in DB
               axios.post('/addToWatchlist', { company: currentCompany })
          }
     }

     // /**
     //  * Called on inital render from Watchlist component
     //  */
     @action
     setCustomWatchlist = async () => {

          const res = await axios.post('/retrieveWatchlist')
          this.customWatchlist = res.data
          console.log(this.customWatchlist)
     }

     /**
      * Checks for duplicate company being added to myWatchlist.
      * Prevents company from being added to DB if it is a duplicate.
      * 
      * @param {string} company - 'TSLA'
      * @return {boolean} Returns true if the company is a duplicate, false if not.
      */
     companyExists(company) {
          const watchlist = this.customWatchlist;
          return watchlist.includes(company)
     }

     /**
      * Removes company from DB when trash icon is clicked.
      * Removes from markup by filtering out that company from the state of myWatchlist array.
      * 
      * @param {string} company - 'TSLA' 
      */
     @action
     removeFromWatchlist = (company) => {
          axios.post('/removeFromWatchlist', { company })
               .then(res => {
                    if (res.status === 200) {
                         this.customWatchlist = this.customWatchlist.filter(companySymbol => companySymbol !== company)
                    }
               })
     }
}


// const store = new WatchlistStore();
// export default store;
export const WatchlistStoreContext = createContext(new WatchlistStore());