const fs = require('fs')
const rules = './src/data/rules.json'
import { rulesHour } from '../entities/rules.entity'

export const readFile = () => {
    const content = fs.readFileSync('./src/data/rules.json', 'utf-8')
    return JSON.parse(content)
}

export const writeFile = (content: rulesHour ) => {
    const updateFile = JSON.stringify(content)
    fs.writeFileSync('./src/data/rules.json', updateFile, 'utf-8')
}