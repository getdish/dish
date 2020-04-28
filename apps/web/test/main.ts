import { Selector } from 'testcafe'

fixture('Home page').page('http://localhost:19006/')

test('Basic rendering check', async (t) => {
  const divs = Selector('div')
  await t.expect(divs.count).gte(100)
})
