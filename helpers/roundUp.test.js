const roundUp = require('./roundUp')

describe('Correct Rounded To The Smallest Currency with fixed 2 digit after decimal point', () => {
  it('Should return value to upper bound', () => {
    expect(roundUp(0.023)).toEqual('0.03')
  })
  it('Should return value with fixed 2 digit after decimal point', () => {
    expect(roundUp(1)).toEqual('1.00')
  })
})
