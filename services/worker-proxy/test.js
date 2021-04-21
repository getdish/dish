const { webkit } = require('playwright-webkit')

;(async () => {
  const browser = await webkit.launch({
    headless: true,
  })
  const page = await browser.newPage()
  await page.goto('https://yelp.com')
  const out = await page.evaluate(
    (uri) =>
      fetch(uri, {
        headers: {
          'content-type': 'application/json',
          accept: 'application/json',
          'Accept-Encoding': 'br;q=1.0, gzip;q=0.8, *;q=0.1',
        },
      }).then((res) => res.json()),
    'https://www.yelp.com/search/snippet?cflt=restaurants&l=g%3A-122.41335000000001%2C37.758125%2C-122.41135%2C37.760124999999995&start=0'
  )
  console.log(out)
  await browser.close()
})()

// const p2 = require('playwright')

// async function main() {
//   const b = await p2.webkit.launch({
//     headless: true,
//     proxy: {
//       // server: 'http://173.208.136.50:19006',
//       server: 'zproxy.lum-superproxy.io:22225',
//       username: 'lum-customer-hl_049d0839-zone-static_res-ip-154.30.225.199',
//       password: 'msjczrv65ntl',
//     },
//   })
//   const p = await b.newPage()
//   await p.goto('https://yelp.com')
//   await p.goto(
//     'https://www.yelp.com/search/snippet?cflt=restaurants&l=g%3A-122.41335000000001%2C37.760124999999995%2C-122.41135%2C37.758125&start=0'
//   )
//   const out = ((await p.textContent('body')) ?? '').trim()
//   console.log('got', out)
//   process.exit(0)
// }

// main()
