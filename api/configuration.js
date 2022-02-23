require('dotenv').config()

const axios = require('axios')
const API_CONFIGURATION_ENDPOINTS = require('../constants/apiConfigurationEndpoints')

const API = axios.create({
  baseURL: process.env.API_URL
})

const apiConfiguration = () =>
  Promise.all(API_CONFIGURATION_ENDPOINTS.map((endpoint) => API.get(endpoint)))
    .then(([cashIn, cashOutJuridical, CashOutNatural]) => ({
      cashIn: cashIn.data,
      cashOut: {
        juridical: cashOutJuridical.data,
        natural: CashOutNatural.data
      }
    }))
    .catch((error) => {
      throw new Error(JSON.stringify({ status: 'rejected', reason: error.message }))
    })

module.exports = apiConfiguration
