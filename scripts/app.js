import fs from 'fs'
import fetch from 'node-fetch'
import { parse } from 'node-html-parser'

console.log('Fetching foods and drinks page...')
const foodsAndDrinksHtml = await (await fetch('https://www.eslowcarbdiet.com/index.php?s=')).text()

console.log('Parsing foods and drinks page...')
const foodsAndDrinks = Array.from(parse(foodsAndDrinksHtml).querySelectorAll('.entry-title>a')).map((a) =>
  a.getAttribute('href'),
)

// foodsAndDrinks = ["https://www.eslowcarbdiet.com/blackberries/",...]
const chunkSize = 10
const totalCount = foodsAndDrinks.length
while (foodsAndDrinks.length) {
  const chunk = foodsAndDrinks.splice(0, chunkSize).filter((url) => !fs.existsSync(`./data/${getFilename(url)}.json`))

  if (!chunk.length) continue

  console.log(`[${totalCount - foodsAndDrinks.length}/${totalCount}]`)
  console.log('Fetching food/drink pages...')
  const chunkPages = await Promise.all(
    chunk.map(async (url) => {
      const res = await fetch(url)
      return res.text()
    }),
  )

  console.log('Parsing food/drink pages and saving data...')
  await Promise.all(
    chunkPages.map((pageHtml, i) => {
      const pageDom = parse(pageHtml)
      const title = pageDom.querySelector('.entry-title').firstChild.textContent.trim().replace(/\?$/, '')
      const content = pageDom.querySelector('.entry-content > p:nth-child(1)').textContent.trim()

      return fs.promises.writeFile(
        `./data/${getFilename(chunk[i])}.json`,
        JSON.stringify({ title, allowed: content.startsWith('Yes'), content }),
      )
    }),
  )
}

function getFilename(url) {
  // url = 'https://www.eslowcarbdiet.com/blackberries/'
  const splitUrl = url.split('/')

  return splitUrl[splitUrl.length - 2]
}
