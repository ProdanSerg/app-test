const storage = require('./weekTransactions')

const transaction = {
  date: '2016-01-05',
  user_id: 1,
  user_type: 'natural',
  type: 'cash_in',
  operation: { amount: 200.0, currency: 'EUR' }
}

describe('Correct Return Amount Transaction By The Week', () => {
  it('Should return 0 for empty storage', () => {
    expect(storage.amount(transaction.user_id, transaction.date)).toEqual(0)
  })
  it('Should return 200 for one transaction in storage', () => {
    storage.add(transaction)
    expect(storage.amount(transaction.user_id, transaction.date)).toEqual(200)
  })
})
