const roundUp = require('../helpers/roundUp')
const storage = require('../storage/weekTransactions')
const chargeDefinition = require('../helpers/chargeDefinition')
const { USER_TYPE_JURIDICAL, USER_TYPE_NATURAL } = require('../constants/usersTypes')
const { TRANSACTION_TYPE_CASH_IN, TRANSACTION_TYPE_CASH_OUT } = require('../constants/transactionTypes')

const juridicalFee = (transaction, configuration) => {
  const fee = transaction.operation.amount * configuration.percents * 0.01
  return roundUp(Math.max(fee, configuration.min.amount))
}

const naturalFee = (transaction, configuration) => {
  const weekLimit = configuration.week_limit.amount
  const weekAmount = storage.amount(transaction.user_id, transaction.date)
  const freeChargeRest = chargeDefinition(weekLimit - weekAmount)

  const amountToCharge = chargeDefinition(transaction.operation.amount - freeChargeRest)

  storage.add(transaction)
  return roundUp(amountToCharge * configuration.percents * 0.01)
}

const cashInFee = (transaction, configuration) => {
  const fee = transaction.operation.amount * configuration.percents * 0.01
  return roundUp(Math.min(fee, configuration.max.amount))
}

const cashOutFee = (transaction, configuration) => {
  switch (transaction.user_type) {
    case USER_TYPE_NATURAL:
      return naturalFee(transaction, configuration.natural)
    case USER_TYPE_JURIDICAL:
      return juridicalFee(transaction, configuration.juridical)
    default:
      throw Error('Unexpected user type')
  }
}

const calculateFee = (transaction, configuration) => {
  switch (transaction.type) {
    case TRANSACTION_TYPE_CASH_IN:
      return cashInFee(transaction, configuration.cashIn)
    case TRANSACTION_TYPE_CASH_OUT:
      return cashOutFee(transaction, configuration.cashOut)
    default:
      throw Error('Unexpected transaction type')
  }
}

const calculateTransactionsFee = (transactions, configuration) =>
  transactions.map((transaction) => calculateFee(transaction, configuration))

module.exports = { calculateTransactionsFee, calculateFee, cashOutFee, cashInFee, naturalFee, juridicalFee }
