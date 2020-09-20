import { Hour } from "./hour.entity"

export class rulesHour {
  id: string
  type: {
    type: string
    days: string[]
  }
  date: string
  day: string
  freeHours: Hour[]
}
