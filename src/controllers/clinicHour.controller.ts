import { Request, Response } from 'express'
import { rulesHour } from '../entities/rules.entity'
import { readFile, writeFile } from '../services/clinicHour.service'
import { freeHours, compareHours } from '../middleware/verifyFreeHours'
import { Hour } from '../entities/hour.entity'
import { isValidDate } from '../helpers/helps'

class clinicHour {
  /**
   *
   * @param req send array of days[] with array of hour into the days
   * @param res save and verify
   */

  public storeRulesWeek(req: Request, res: Response) {
    let rules = new rulesHour()
    const fullHours = req.body.rules
    try {
      fullHours.map((days: rulesHour) => {
        const cContent = readFile()
        const dayHours = days.freeHours
        const selectedItem = cContent.findIndex(
          (item: rulesHour) => item.day === days.day
        )
        if (selectedItem >= 0) {
          const {
            id: cId,
            type: cType,
            day: cDay,
            freeHours: cFreeHours
          } = cContent[selectedItem]
          let arrayData: Hour[] = dayHours.map((data: Hour) => {
            const valid = compareHours(data, days.day)
            if (valid?.error) {
              throw valid?.conflictDate
            }
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
            const valid = compareHours(data, days.day)
            if (valid?.error) {
              throw valid?.conflictDate
            }
            return data
          })

          if (!isValidDate(days.day)) {
            throw 'not date'
          }
          const id = Math.random().toString(32).substr(2, 9)
          rules.id = id
          rules.type = days.type
          rules.day = days.day

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
      (item: rulesHour) => item.day === date1
    )
    const secondDate = cContent.findIndex(
      (item: rulesHour) => item.day === date2
    )
    console.log(firstDate, secondDate)
    //const element = cContent[filtred]
    //onst free = freeHours(element.day)
    res.status(200).json()
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
