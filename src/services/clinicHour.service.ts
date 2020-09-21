const fs = require('fs')
import { rulesHour } from '@entities/rules.entity'
import { Hour } from '@entities/hour.entity'
import { compareHours } from '@middleware/verifyFreeHours'

export const readFile = () => {
    const content = fs.readFileSync('./src/data/rules.json', 'utf-8')
    return JSON.parse(content)
}

export const writeFile = (content: rulesHour ) => {
    const updateFile = JSON.stringify(content)
    fs.writeFileSync('./src/data/rules.json', updateFile, 'utf-8')
}

export const updateHour = (field: number, hour: Hour[]) =>{
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