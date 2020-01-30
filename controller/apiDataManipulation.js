const historicalDataManipulation = (response) => {
     let totalPrice = 0;
     let allClosingPricesAndDates = [];
     const allHistoricalData = response.data.history

     const allHistoricalPrices = Object.values(allHistoricalData)
     const allHistoricalDates = Object.keys(allHistoricalData)

     for (let i = 0; i < allHistoricalPrices.length; i++) {
          totalPrice += parseInt(allHistoricalPrices[i].close)
          allClosingPricesAndDates.push(
               {
                    date: allHistoricalDates[i],
                    value: parseFloat(allHistoricalPrices[i].close).toFixed(2)
               })
     }

     const avgPrice = totalPrice / allHistoricalPrices.length;
     return { avgPrice: avgPrice, graphData: allClosingPricesAndDates }
}

exports.historicalDataManipulation = historicalDataManipulation;