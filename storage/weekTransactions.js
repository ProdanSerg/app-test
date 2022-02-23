const moment = require('moment')

moment.locale('uk', { week: { dow: 1 } })

const weekTransactionsStorage = {}

const add = (transaction) => {
  const userId = transaction.user_id
  if (userId in weekTransactionsStorage) {
    const userTransactions = weekTransactionsStorage[userId]
    userTransactions.push(transaction)
  } else {
    weekTransactionsStorage[userId] = [transaction]
  }
}

const amount = (userId, weekDate) => {
  const userTransactions = weekTransactionsStorage[userId]

  if (userTransactions) {
    const weekTransactions = userTransactions.filter((transaction) => moment(transaction.date).isSame(weekDate, 'week'))
    return weekTransactions.reduce((amount, transaction) => amount + transaction.operation.amount, 0)
  }

  return 0
}

module.exports.amount = amount
module.exports.add = add
