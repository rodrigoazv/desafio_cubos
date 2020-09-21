const fs = require('fs')

export const clear = () => {
  const content = []
  const updateFile = JSON.stringify(content)
  fs.writeFileSync('./src/data/rules.json', updateFile, 'utf-8')
}
