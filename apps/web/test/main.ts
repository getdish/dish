import { Selector } from 'testcafe'

fixture('Home page').page('http://localhost:19006/')

test('Basic rendering check', async (t) => {
  const divs = Selector('div')
  const numDivs = await divs.count
  await t.expect(numDivs).gte(50)
})

// test('Renders home top dishes', async (t) => {
//   const topDishes = Selector('.home-top-dish')
//   await t.expect(topDishes.count).gte(4)
// })
