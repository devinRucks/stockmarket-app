/**
 * am4core (the chart used for this program) requires the data to be an array of objects.
 * This function manipulate the stock data coming from the API and makes it fit the required format of the chart.
 * Out of all the data from the API, we only use the date and closing price.
 */
const dataManipulation = (response) => {
     // response.data.data is an array of objects
     const allStockInfo = response.data.data;

     let closingPricesAndDates = [];

     for (let i = 0; i < allStockInfo.length; i++) {
          closingPricesAndDates.push(
               {
                    date: allStockInfo[i].date,
                    value: parseFloat(allStockInfo[i].close).toFixed(2)
               })
     }
     return { dataForGraph: closingPricesAndDates }
}

exports.dataManipulation = dataManipulation;