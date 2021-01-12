// @ts-ignore
import { JSDOM } from 'jsdom'

export function shimBrowser() {
  // fake a browser!
  const jsdom = new JSDOM(``, {
    pretendToBeVisual: true,
    url: 'http://dishapp.com/mission',
    referrer: 'http://dishapp.com/',
    contentType: 'text/html',
  })

  // @ts-ignore
  global['window'] = jsdom.window
  global['window']['IS_SSR_RENDERING'] = true
  // @ts-ignore
  global['MouseEvent'] = class MouseEvent {}
  Object.keys(jsdom.window).forEach((key) => {
    if (typeof global[key] === 'undefined') {
      global[key] = jsdom.window[key]
    }
  })

  return jsdom
}
