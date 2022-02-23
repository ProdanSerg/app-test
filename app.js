const fs = require('fs')
const apiConfiguration = require('./api/configuration')
const { calculateTransactionsFee } = require('./components/calculator')

const path = process.argv[2]

if (fs.existsSync(path)) {
  const transactions = JSON.parse(fs.readFileSync(path))
  apiConfiguration()
    .then((configuration) => {
      calculateTransactionsFee(transactions, configuration).forEach((fee) => console.log(fee))
    })
    .catch((error) => {
      console.log(error)
    })
} else {
  throw new Error('No Transaction File Found')
}
