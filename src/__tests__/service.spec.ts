import { sortHour, sortedAll } from '../services/clinicHour.service'
import { rulesHour } from '@entities/rules.entity'

describe('Is valid?', () => {
  it('Value of date should be true', () => {
    const noSort: rulesHour = {
      id: '5u061deh2',
      type: 'day',
      date: '23-10-2030',
      day: 3,
      freeHours: [
        {
          start: '11:40',
          end: '11:50'
        },
        {
          start: '10:00',
          end: '10:30'
        },
        {
          start: '11:00',
          end: '11:30'
        }
      ]
    }

    const isSort = {
      id: '5u061deh2',
      type: 'day',
      date: '23-10-2030',
      day: 3,
      freeHours: [
        {
          start: '10:00',
          end: '10:30'
        },

        {
          start: '11:00',
          end: '11:30'
        },
        {
          start: '11:40',
          end: '11:50'
        }
      ]
    }

    expect(sortHour(noSort)).toEqual(isSort)
  })
})
