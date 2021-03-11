const { Window } = require('happy-dom')
const window = new Window({
  url: 'http://d1live.com/',
  referrer: 'http://d1live.com/',
})
for (const key in window) {
  global[key] = global[key] || window[key]
}
global['MessageChannel'] = require('worker_threads').MessageChannel
