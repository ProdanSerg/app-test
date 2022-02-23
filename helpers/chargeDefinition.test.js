const chargeDefinition = require('./chargeDefinition')

describe('Correct Charge Definition', () => {
  it('Should return 0 for negative value', () => {
    expect(chargeDefinition(-1)).toEqual(0)
  })
  it('Should return positive input value', () => {
    expect(chargeDefinition(20)).toEqual(20)
  })
})
