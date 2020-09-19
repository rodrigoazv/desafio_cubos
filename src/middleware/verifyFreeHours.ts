import { Hour } from "../entities/hour.entity"
import { rulesHour } from "../entities/rules.entity"
const fs = require('fs')

export const verifyFile = ( day: string, hours: Hour) => {
    const content = fs.readFileSync('./src/data/rules.json', 'utf-8')
    content.findIndex((item: rulesHour) => item.day === day)
    return JSON.parse(content)
}