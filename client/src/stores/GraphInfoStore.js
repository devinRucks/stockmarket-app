import { observable, action } from 'mobx'
import { createContext } from 'react';
import moment from 'moment'

class GraphInfoStore {
     @observable startDate = '';
     @observable endDate = '';
     @observable currentCompany = '';
     @observable graphData = {};


     /**
      * Sets the current company to the input value of the search box.
      * The inputValue must not be empty
      * @param {string} inputValue - 'TSLA'
      */
     @action setCurrentCompany = (inputValue) => {
          // Checks to make sure user has typed something in search field.
          if (inputValue !== '') {
               this.currentCompany = inputValue;
          }
     }



     /**
      * Retrieves current date.
      * @example 
      *   2019-12-04
     */
     @action setEndDate = () => {
          const dateObj = new Date();
          const month = dateObj.getUTCMonth() + 1; //months from 1-12
          const day = dateObj.getUTCDate();
          const year = dateObj.getUTCFullYear();
          this.endDate = `${year}-${month}-${day}`
     }


     /**
      * Retrieves date of 30 days from current date. Then formats to fit API requirements.
      * @example 
      *   12-04-2019 -> 2019-12-04
      */
     @action setStartDate = () => {
          let prevMonth = moment().subtract(30, 'days').calendar()
          const prevMonthDate = prevMonth.replace(/\//g, '-');

          let numbers = prevMonthDate.substring(0, 5);
          this.startDate = prevMonthDate.substring(6) + '-' + numbers
     }
}

// const store = new GraphInfoStore();
// export default store;
export const GraphInfoStoreContext = createContext(new GraphInfoStore());
