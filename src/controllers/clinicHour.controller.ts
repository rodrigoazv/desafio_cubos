import { Request, Response } from 'express'
import { rulesHour } from '../entities/rules.entity'
import { readFile, writeFile, updateHour } from '../services/clinicHour.service'
import { freeHours, compareHours } from '../middleware/verifyFreeHours'
import { Hour } from '../entities/hour.entity'
import { isValidDate } from '../helpers/helps'

class clinicHour {
  /**
   *
   * @param req send array of days[] with array of hour into the days
   * @param res save and verify
   */
  public storeSpecialRules(req: Request, res: Response) {
    let { type, days, freeHours } = req.body
    let cContent = readFile()
    if (type === 'Daily') {
      days = [0, 1, 2, 3, 4, 5, 6]
    }
    try {
      freeHours.map((Hours: Hour) => {
        if (Hours.start > Hours.end) throw 'hour can not bee ilogical'
      })
      days.map((dayz: number) => {//para cada dia
        const DayMatch: rulesHour[] = cContent.filter((item: rulesHour) => {
          if (item.day * 1 === dayz * 1) {
            return item
          }
        })//retorne todos os matchs
        freeHours.map((inputHours: Hour) => {//para cada hora do dia
          DayMatch.map(date => {//compare com o match
            const log = compareHours(inputHours, date.date)
            console.log(log)
            if (log.error) {
              throw log.conflictDate
            }
          })
        })
        return { day: dayz, DayMatch }
      }) //----------
      days.map((validDay: number) => {
        const slash = {
          id: Math.random().toString(32).substr(2, 9),
          day: validDay * 1,
          type: type,
          date: '*',
          freeHours: freeHours
        }
        cContent.push(slash)
      })
      writeFile(cContent)
      res.status(200).json({ status: 'ok' })
    } catch (err) {
      res.status(200).json({ err: err })
    }
  }
   /**
   *
   * @param req send array of days[] with array of hour into the days
   * @param res save and verify
   */
  public storeOneRule(req: Request, res: Response) {
    let rules = new rulesHour()
    const { type, freeHours, date } = req.body
    try {
      freeHours.map((Hours: Hour) => {
        if (Hours.start > Hours.end) throw 'hour can not bee ilogical'
      })

      const cContent = readFile()
      const dayHours = freeHours
      const selectedItem = cContent.findIndex(
        (item: rulesHour) => item.date === date
      )
      // Se existe realiza um update
      if (selectedItem >= 0) {
        updateHour(selectedItem, dayHours)
        return res.status(202).json({ status: 'ok', value: 'update' })
      } else {
        let arrayData: Hour[] = dayHours.map((data: Hour) => {
          const valid = compareHours(data, date)
          if (valid?.error) {
            throw valid?.conflictDate
          }
          const validDaily = compareHours(data, '*')
            if (validDaily?.error) {
              throw validDaily?.conflictDate
            }
          return data
        })
        if (!isValidDate(date.toString())) {
          throw 'not date'
        }
        const id = Math.random().toString(32).substr(2, 9)
        //revert a data para encontrar o dia da semana
        let dateNew = new Date(date.split('-').reverse().join())
        const dayFromDate: number = dateNew.getDay() * 1

        rules.id = id
        rules.type = type
        rules.date = date
        rules.day = dayFromDate

        //insere hora no array de horas
        rules.freeHours = arrayData
        cContent.push(rules)
        writeFile(cContent)
        res.status(201).json({ status: 'item created' })
      }
    } catch (err) {
      res.status(400).json({ err: err })
    }
  }
 /**
   *
   * @param req send array of days[] with array of hour into the days
   * @param res save and verify
   */

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
    const firstDaily = cContent.findIndex(
      (item: rulesHour) => item.date === '*'
    )
    const lastDaily = cContent.findIndex(
      (item: rulesHour) => item.date === '*' && item.day ===6
    )
    const queryInterval = cContent.slice(firstDate, secondDate + 1)
    const query = queryInterval.map((day: rulesHour) => {
      const obj = {
        day: day.date,
        freeHours: freeHours(day.date)
      }
      return obj
    })
    const dailyInterval = cContent.slice(firstDaily, lastDaily+1)
    const daily = dailyInterval.map((day: rulesHour) => {
      const obj = {
        day: day.date,
        freeHours: freeHours(day.date)
      }
      return obj
    })

    res.status(200).json({query: query, daily: daily})
  }

  public deleteRules(req: Request, res: Response) {
    const { id } = req.params
    const currentContent = readFile()
    const selectedItem = currentContent.findIndex((item: rulesHour) => item.id === id)
    currentContent.splice(selectedItem, 1)
    writeFile(currentContent)
    res.status(200).json({deleted: currentContent})
  }
}

export default new clinicHour()
/**public storeMultipleRules(req: Request, res: Response) {
    let rules = new rulesHour()
    const fullHours = req.body.rules
    try {
      fullHours.map((days: rulesHour) => {
        const cContent = readFile()
        const dayHours = days.freeHours
        const selectedItem = cContent.findIndex(
          (item: rulesHour) => item.date === days.date
        )
        // Se existe realiza um update
        if (selectedItem >= 0) {
          updateHour(selectedItem, dayHours)
          return res.status(200).json({ status: 'ok', value: 'update' })
        } else {
          let arrayData: Hour[] = dayHours.map((data: Hour) => {
            //Comparar com o dia
            const valid = compareHours(data, days.date)
            if (valid?.error) {
              throw valid?.conflictDate
            }
            //Comparar com ocorrências diárias
            const validDaily = compareHours(data, '*')
            if (validDaily?.error) {
              throw validDaily?.conflictDate
            }
            return data
          })
          if (!isValidDate(days.date.toString())) {
            throw 'not date'
          }
          const id = Math.random().toString(32).substr(2, 9)
          //revert a data para encontrar o dia da semana
          let date = new Date(days.date.split('-').reverse().join())
          const dayFromDate: number = date.getDay() * 1

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
  } */