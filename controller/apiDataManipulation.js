const historicalDataManipulation = (response) => {
     let allClosingPricesAndDates = [];
     const allHistoricalData = response.data.history

     const allHistoricalPrices = Object.values(allHistoricalData)
     const allHistoricalDates = Object.keys(allHistoricalData)

     for (let i = 0; i < allHistoricalPrices.length; i++) {
          allClosingPricesAndDates.push(
               {
                    date: allHistoricalDates[i],
                    value: parseFloat(allHistoricalPrices[i].close).toFixed(2)
               })
     }

     return { graphData: allClosingPricesAndDates }
}

exports.historicalDataManipulation = historicalDataManipulation;