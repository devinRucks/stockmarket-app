const express = require('express')
const router = express.Router()
const withAuth = require('../../controller/middleware');
const axios = require('axios');
const utils = require('../controller/apiDataManipulation');

router.route('/')
     .post(withAuth, async (req, res) => {
          let stockSymbol = req.body.stockSymbol
          let currentDate = req.body.currentDate
          let prevMonthDate = req.body.prevMonthDate

          const stockDataAPI = `https://api.marketstack.com/v1/eod?access_key=${process.env.STOCK_DATA_API_KEY}&symbols=${stockSymbol}&date_from=${prevMonthDate}&date_to=${currentDate}`

          try {
               const APIResponse = await axios.get(stockDataAPI)
               const datesAndPrices = utils.dataManipulation(APIResponse)

               res.json({
                    'dataForGraph': datesAndPrices.dataForGraph
               })
          } catch (error) {
               res.status(401).send("This company does not exist")
               return
          }
     })


module.exports = router;