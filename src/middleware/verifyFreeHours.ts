import { Hour } from '../entities/hour.entity'
import { rulesHour } from '../entities/rules.entity'
import { readFile } from '../services/clinicHour.service'
import { convertMinute } from '../helpers/helps'

export const freeHours = (day: string) => {
  const content = readFile()

  const element = content.findIndex((item: rulesHour) => item.day === day)
  const filtred = content[element].freeHours

  let flag: number = 0
  let array: [{ start: number; end: number }] = [
    { start: convertMinute(filtred[filtred.length - 1].end), end: 23 * 60 + 59 }
  ]
  filtred.map((data: Hour) => {
    if (flag <= convertMinute(data.start)) {
      array.push({ start: Number(flag), end: convertMinute(data.start) })
      flag = convertMinute(data.end)
    }
  })
  return array
}

export const compareHours = (value: Hour, day: string) => {
  const content = readFile()
  try{
    const element = content.findIndex((item: rulesHour) => item.day === day)
    const filtred = content[element].freeHours
    filtred.map((data: Hour) =>{
        if(!(data.end<= value.start|| data.start >= value.end)){
            throw day
        }else{
            return true
        }
      })
      
  }catch(err){
      return {error: true, conflictDate : err}
  }
  
  
}
/*for(var i = 0; i < filtred.freeHours.length(); i++){
    let flag:number = 0;
    let array: [{}] = [{}];
    if(filtred.freeHours[i].start > flag){
        array.push({start: flag , end:filtred.freeHours[i].start})
        flag= filtred.freeHours[i].end
    }
    console.log(array)
  }*/
