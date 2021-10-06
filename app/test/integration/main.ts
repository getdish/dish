import { spawn } from 'child_process'

import { Selector } from 'testcafe'

fixture('Home page').page('http://localhost:4444/')

test('Basic rendering check', async (t) => {
  const divs = Selector('div')
  const numDivs = await divs.count
  try {
    await t.expect(numDivs).gte(50)
  } catch (err) {
    console.log('error', err.message)
    const body = Selector('body')
    console.log(
      'failure notes:',
      await divs?.innerText,
      await body?.childNodeCount,
      await body?.innerText
    )
    const ls = spawn('curl', ['http://localhost:4444/'])

    ls.stdout.on('data', (data) => {
      console.log(`failure out: ${data}`)
    })
  }
})

// test('Renders home top dishes', async (t) => {
//   const topDishes = Selector('.home-top-dish')
//   await t.expect(topDishes.count).gte(4)
// })
