import { Request, Response } from 'express'
import { rulesHour } from '../entities/rules.entity'
import { readFile, writeFile } from '../services/clinicHour.service'
import { freeHours, compareHours } from '../middleware/verifyFreeHours'
import { Hour } from '../entities/hour.entity'
import { isValidDate } from '../helpers/helps'

//Normalize e um tipo para validar um array de dias que foram cadastrados anteriormente
interface Normalizes {
  day: string
  DayMatch?: rulesHour[]
}
class clinicHour {
  /**
   *
   * @param req send array of days[] with array of hour into the days
   * @param res save and verify
   */
  public storeSpecialRules(req: Request, res: Response) {
    let rules = new rulesHour()
    const { type, days, freeHours } = req.body

    try {
      const cContent = readFile()

      const all = days.map((dayz: string) => {
        const DayMatch: rulesHour[] = cContent.filter((item: rulesHour) => {
          if (item.day === dayz) {
            return item
          }
        })
        freeHours.map((inputHours: Hour) => {
          DayMatch.map(date => {
            const log = compareHours(inputHours, date.date)
            if (log.error) {
              throw log.conflictDate
            }
            return date
          })
          return DayMatch
        })
        return { day: dayz, DayMatch }
      }) //----------
      days.map((dayz: string) => {
        cContent.map((item: rulesHour, index:number) => {
          if (item.day === dayz) {
            const newArr = freeHours.concat(item.freeHours)
            const newObj = {
              id: item.id,
              type: item.type,
              day: item.day,
              date: item.date,
              freeHours: newArr
            }
            cContent[index] = newObj
            writeFile(cContent)
          }
        })
      })

      res.status(200).json(all)
    } catch (err) {
      res.status(200).json({ err: err })
    }
  }
  public storeRulesWeek(req: Request, res: Response) {
    let rules = new rulesHour()
    const fullHours = req.body.rules
    const dayBr = [
      'Domingo',
      'Segunda',
      'Terca',
      'Quarta',
      'Quinta',
      'Sexta',
      'Sabado'
    ]
    try {
      fullHours.map((days: rulesHour) => {
        const cContent = readFile()
        const dayHours = days.freeHours
        const selectedItem = cContent.findIndex(
          (item: rulesHour) => item.date === days.date
        )
        // Se existe realiza um update
        if (selectedItem >= 0) {
          const {
            id: cId,
            type: cType,
            day: cDay,
            freeHours: cFreeHours
          } = cContent[selectedItem]

          let arrayData: Hour[] = dayHours.map((data: Hour) => {
            const valid = compareHours(data, days.date)
            if (valid?.error) {
              throw valid?.conflictDate
            }
            console.log(valid)
            return data
          })
          const newArr = arrayData.concat(cFreeHours)
          const newObj = {
            id: cId,
            type: cType,
            day: cDay,
            freeHours: newArr
          }
          cContent[selectedItem] = newObj
          writeFile(cContent)
          return res.status(200).json({ status: 'ok', value: 'update' })
        } else {
          let arrayData: Hour[] = dayHours.map((data: Hour) => {
            const valid = compareHours(data, days.date)
            if (valid?.error) {
              throw valid?.conflictDate
            }
            return data
          })
          if (!isValidDate(days.date.toString())) {
            throw 'not date'
          }
          const id = Math.random().toString(32).substr(2, 9)
          //revert a data para encontrar o dia da semana
          let date = new Date(days.date.split('-').reverse().join())
          const dayFromDate = dayBr[date.getUTCDay()]

          rules.id = id
          rules.type = days.type
          rules.date = days.date
          rules.day = dayFromDate

          //insere hora no array de horas
          rules.freeHours = arrayData
          cContent.push(rules)
          writeFile(cContent)
          res.status(200).json({ status: 'ok' })
        }
      })
    } catch (err) {
      res.status(200).json({ err: err })
    }
  }

  public indexRules(req: Request, res: Response) {
    const cContent = readFile()
    res.status(200).json(cContent)
  }

  public seeRulesFree(req: Request, res: Response) {
    const { date1, date2 } = req.query
    const cContent = readFile()
    const firstDate = cContent.findIndex(
      (item: rulesHour) => item.date === date1
    )
    const secondDate = cContent.findIndex(
      (item: rulesHour) => item.date === date2
    )
    const queryInterval = cContent.slice(firstDate, secondDate + 1)
    const all = queryInterval.map((day: rulesHour) => {
      const obj = {
        day: day.date,
        freeHours: freeHours(day.date)
      }
      return obj
    })
    //const element = cContent[filtred]
    //onst free = freeHours(element.day)
    res.status(200).json(all)
  }

  public deleteRules(req: Request, res: Response) {}
}

export default new clinicHour()

/*/public storeRulesPerDay(req: Request, res: Response) {
    let rules = new rulesHour()

    const { type, day } = req.body
    const dayHours = req.body.freeHours

    const id = Math.random().toString(32).substr(2, 9)
    rules.id = id
    rules.type = type
    rules.day = day
    //insere hora
    let arrayData: [Hour] = dayHours.map((data: Hour) => {
      return data
    })
    //insere hora no array de horas
    rules.freeHours = arrayData
    const cContent = readFile()
    cContent.push(rules)
    writeFile(cContent)

    res.status(200).json({ status: 'ok' })
  } */
