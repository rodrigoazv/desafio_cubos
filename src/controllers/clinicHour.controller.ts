import { Request, Response } from 'express'
import { rulesHour } from '../entities/rules.entity'
import { readFile, writeFile } from '../services/clinicHour.service'
import { Hour } from '../entities/hour.entity'

class clinicHour {
  public storeRulesPerDay(req: Request, res: Response) {
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
  }

  /**
   * 
   * @param req send array of days[] with array of hour into the days
   * @param res save and verify
   */

   
  public storeRulesWeek(req: Request, res: Response) {
    let rules = new rulesHour()
    const fullHours = req.body.rules;

    fullHours.map((days: rulesHour) => {
      const dayHours = days.freeHours
      console.log(days)
      const id = Math.random().toString(32).substr(2, 9)
      rules.id = id
      rules.type = days.type
      rules.day = days.day
      //insere hora
      let arrayData: Hour[] = dayHours.map((data: Hour) => {
        return data
      })
      //insere hora no array de horas
      rules.freeHours = arrayData
      const cContent = readFile()
      cContent.push(rules)
      writeFile(cContent)
    })
    res.status(200).json({ status: 'ok' })
  }
  public indexRules(req: Request, res: Response) {
    const cContent = readFile()
    res.status(200).json(cContent)
  }
  public seeRulesFree(req: Request, res: Response) {}
  public deleteRules(req: Request, res: Response) {}
}

export default new clinicHour()
