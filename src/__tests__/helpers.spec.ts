import { isValidDate } from '@helpers/helps'

describe('Is valid?', () => {
  it('Value of date should be true', () => {
    expect(isValidDate('10-12-2020')).toEqual(true)
  })
  it('Value of date should be true', () => {
    expect(isValidDate('10-13-2020')).toEqual(false)
  })
})
