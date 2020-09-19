import { Hour } from '../entities/hour.entity'
import { rulesHour } from '../entities/rules.entity'
import { readFile } from '../services/clinicHour.service'
/**
 * 
 * @param day recebe uma string do tipo dia no formato correto 
 * @function freeHours recebe um dia e calcula as horas livres possiveis do dia
 * Leva em consideracao que o ultimo horário sempre será 23:59
 */
export const freeHours = (day: string) => {
  const content = readFile()

  const element = content.findIndex((item: rulesHour) => item.day === day)
  const filtred = content[element].freeHours

  let flag: string = '00:00'
  let array: [Hour] = [{ start: filtred[filtred.length - 1].end, end: '23:59' }]
  filtred.map((data: Hour) => {
    if (flag <= data.start) {
      array.push({ start: flag, end: data.start })
      flag = data.end
    }
  })
  return array
}
/**
 * 
 * @param day recebe uma string do tipo dia no formato correto 
 * @param value recebe um valor tipo hora, e valida se existe conflito dentro do arquivo
 * @function freeHours recebe um dia e calcula as horas livres possiveis do dia
 * Leva em consideracao que o ultimo horário sempre será 23:59
 */
export const compareHours = (value: Hour, day: string) => {
  const content = readFile()
  try {
    const element = content.findIndex((item: rulesHour) => item.day === day)
    if (element >= 0) {
      const filtred = content[element].freeHours
      filtred.map((data: Hour) => {
        if (!(data.end <= value.start || data.start >= value.end)) {
          throw day
        } else {
          return true
        }
      })
    } else{
        return
    }
  } catch (err) {
    return { error: true, conflictDate: err }
  }
}
