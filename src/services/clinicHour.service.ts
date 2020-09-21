const fs = require('fs')
import { rulesHour } from '../entities/rules.entity'
import { Hour } from '../entities/hour.entity'
import { compareHours } from '../middleware/verifyFreeHours'

export const readFile = () => {
  const content = fs.readFileSync('./src/data/rules.json', 'utf-8')
  return JSON.parse(content)
}

export const writeFile = (content: rulesHour[]) => {
  const contentSorted:rulesHour[] = content.map(one => {
    return sortHour(one)
  })
  const updateFile = JSON.stringify(sortedAll(contentSorted))
  fs.writeFileSync('./src/data/rules.json', updateFile, 'utf-8')
}
export const sortHour = (file: rulesHour) => {
  const sortedHour: Hour[] = file.freeHours.sort((a: Hour, b: Hour) => {
    const first = a.start + a.end
    const second = b.start + b.end
    if (first > second) {
      return 1
    }
    if (first < second) {
      return -1
    }
    // a must be equal to b
    return 0
  })
  const sorted: rulesHour = {
    id: file.id,
    date: file.date,
    day: file.day,
    type: file.type,
    freeHours: sortedHour
  }
  return sorted
}

export const sortedAll = (file: rulesHour[]) => {
  const sortedHour: rulesHour[] = file.sort((a, b) => {
    if (a.day > b.day) {
      return 1
    }
    if (a.day < b.day) {
      return -1
    }
    // a must be equal to b
    return 0
  })
  return sortedHour
}

export const updateHour = (field: number, hour: Hour[]) => {
  const cContent = readFile()
  const {
    id: cId,
    type: cType,
    day: cDay,
    date: cDate,
    freeHours: cFreeHours
  } = cContent[field]

  let arrayData: Hour[] = hour.map((data: Hour) => {
    const valid = compareHours(data, cDate)
    if (valid?.error) {
      throw valid?.conflictDate
    }
    return data
  })
  const newArr = arrayData.concat(cFreeHours)
  const newObj = {
    id: cId,
    type: cType,
    date: cDate,
    day: cDay,
    freeHours: newArr
  }
  cContent[field] = newObj
  writeFile(cContent)
  return cContent
}
