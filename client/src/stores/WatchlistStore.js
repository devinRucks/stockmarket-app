import { observable } from 'mobx'
import axios from 'axios';

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
     @action addToWatchlist = (currentCompany) => {
          if (!this.companyExists(currentCompany)) {
               // if company does not already exist, add it to custom watchlist
               this.customWatchlist.push(currentCompany)

               // send the company to the server which will eventually be stored in DB
               axios.post('/addToWatchlist', { company: currentCompany })
          }
     }



     /**
      * Called on inital render from Watchlist component
      */
     @action getCurrentWatchlist = () => {
          axios.post('/retrieveWatchlist')
               .then(res => {
                    this.customWatchlist = [...res.data]
               })
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
}


const store = new WatchlistStore();
export default store;