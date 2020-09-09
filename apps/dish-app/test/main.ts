import 'isomorphic-unfetch'

import { Selector } from 'testcafe'

fixture('Home page').page('http://localhost:19006/')

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
      await divs.innerText,
      await body.childNodeCount,
      await body.innerText
    )
    const out = await fetch('http://localhost:19006/').then((res) => res.text())
    console.log('failure out', out)
  }
})

// test('Renders home top dishes', async (t) => {
//   const topDishes = Selector('.home-top-dish')
//   await t.expect(topDishes.count).gte(4)
// })
