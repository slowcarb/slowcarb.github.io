import fs from 'fs'

const dataOutputPath = '../public/data.json'
const dataFiles = fs.readdirSync('./data/')

if (fs.existsSync(dataOutputPath)) {
  fs.unlinkSync(dataOutputPath)
}

const data = await Promise.all(dataFiles.map((filename) => fs.promises.readFile(`./data/${filename}`, 'utf-8')))
fs.writeFileSync(dataOutputPath, `[${data.join(',')}]`)
