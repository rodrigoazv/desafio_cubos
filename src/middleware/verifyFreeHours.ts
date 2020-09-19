import { Hour } from "../entities/hour.entity"
const fs = require('fs')

export const readFile = (day: string, hours: Hour) => {
    const content = fs.readFileSync('./src/data/rules.json', 'utf-8')
    return JSON.parse(content)
}