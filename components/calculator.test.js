const fs = require('fs')
const {
  juridicalFee,
  naturalFee,
  cashInFee,
  cashOutFee,
  calculateFee,
  calculateTransactionsFee
} = require('./calculator')

const configuration = {
  cashIn: JSON.parse(fs.readFileSync('./configs/cash-in.json')),
  cashOut: {
    juridical: JSON.parse(fs.readFileSync('./configs/cash-out-legal.json')),
    natural: JSON.parse(fs.readFileSync('./configs/cash-out-natural.json'))
  }
}

const transactions = JSON.parse(fs.readFileSync('./input.json'))

const juridicalTransactionUserType = {
  date: '2016-01-06',
  user_id: 2,
  user_type: 'juridical',
  type: 'cash_out',
  operation: { amount: 300.0, currency: 'EUR' }
}

const naturalTransactionUserType = {
  date: '2016-01-06',
  user_id: 1,
  user_type: 'natural',
  type: 'cash_out',
  operation: { amount: 30000, currency: 'EUR' }
}

const unexpectedTransactionUserType = {
  date: '2016-01-06',
  user_id: 1,
  user_type: 'unexpected',
  type: 'cash_out',
  operation: { amount: 30000, currency: 'EUR' }
}

const cashInTransactionType = {
  date: '2016-01-05',
  user_id: 1,
  user_type: 'natural',
  type: 'cash_in',
  operation: { amount: 200.0, currency: 'EUR' }
}

const cashInTransactionTypeLimit = {
  date: '2016-01-05',
  user_id: 1,
  user_type: 'natural',
  type: 'cash_in',
  operation: { amount: 20000.0, currency: 'EUR' }
}

const cashOutTransactionType = {
  date: '2016-01-06',
  user_id: 2,
  user_type: 'juridical',
  type: 'cash_out',
  operation: { amount: 300.0, currency: 'EUR' }
}

const unexpectedTransactionType = {
  date: '2016-01-05',
  user_id: 1,
  user_type: 'natural',
  type: 'unexpected',
  operation: { amount: 200.0, currency: 'EUR' }
}

test('Return correct calculated transaction fee array output', () => {
  expect(calculateTransactionsFee(transactions, configuration)).toStrictEqual([
    '0.06',
    '0.90',
    '87.00',
    '3.00',
    '0.30',
    '0.30',
    '5.00',
    '0.00',
    '0.00'
  ])
})

describe('Return correct calculated fee for cash in transaction type', () => {
  it('Should Return "0.06" Fee', () => {
    expect(cashInFee(cashInTransactionType, configuration.cashIn)).toEqual('0.06')
  })
  it('Should return "5.00" maximum amount fee', () => {
    expect(cashInFee(cashInTransactionTypeLimit, configuration.cashIn)).toEqual('5.00')
  })
})

describe('Return correct cash out fee by transaction type', () => {
  it('Should return "0.06". Correct calculated fee for Cash In transaction type', () => {
    expect(calculateFee(cashInTransactionType, configuration)).toEqual('0.06')
  })
  it('Should return "0.90". Correct calculated fee for CashOut transaction type', () => {
    expect(calculateFee(cashOutTransactionType, configuration)).toEqual('0.90')
  })
  it('Should return "Error" for unexpected transaction type', () => {
    expect(() => calculateFee(unexpectedTransactionType, configuration)).toThrow('Unexpected transaction type')
  })
})

describe('Return correct Cash Out fee by user type', () => {
  it('Should return "90.00". Correct calculated fee for Natural User type', () => {
    expect(cashOutFee(naturalTransactionUserType, configuration.cashOut)).toEqual('90.00')
  })
  it('Should return "0.90". Correct calculated fee for Juridical User type', () => {
    expect(cashOutFee(juridicalTransactionUserType, configuration.cashOut)).toEqual('0.90')
  })
  it('Should return "Error" for Unexpected User type', () => {
    expect(() => cashOutFee(unexpectedTransactionUserType, configuration.cashOut)).toThrow('Unexpected user type')
  })
})

test('Should return correct calculated fee for single Juridical User type transaction', () => {
  expect(juridicalFee(juridicalTransactionUserType, configuration.cashOut.juridical)).toEqual('0.90')
})

test('Should return correct calculated fee for single Natural User type transaction', () => {
  expect(naturalFee(naturalTransactionUserType, configuration.cashOut.natural)).toEqual('90.00')
})
