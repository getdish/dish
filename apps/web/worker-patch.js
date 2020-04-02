const fs = require('fs')
const file = fs.readFileSync('./web-build/static/js/app.js', 'utf8')

let out = ``

for (const line of file.split('\n')) {
  if (
    line ===
    `		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");`
  ) {
    out += `return null\n`
    continue
  }
  if (line == `        urlParsingNode.setAttribute('href', href);`) {
    out += `${line}\n`
    out += `urlParsingNode.pathname = '/'\n`
    continue
  }
  if (line == `  Dimensions._update = function _update() {`) {
    out += `win.screen = {}\n`
    out += `${line}\n`
    continue
  }
  if (
    line ==
    `var isLocation = hasWindow && !!(window.history.location || window.location);`
  ) {
    out += `var isLocation = false\n`
    continue
  }
  if (line == `      this._createImageLoader();`) {
    continue
  }
  if (line == `  load: function load(uri, onLoad, onError) {`) {
    out += `  load: function load(uri, onLoad, onError) {return\n`
    continue
  }
  if (line == `      this._createImageLoader();`) {
    continue
  }
  if (
    line ==
    `            throw new Error('E_FONT_CREATION_FAILED : document element cannot support injecting fonts');`
  ) {
    out += `console.error('cant create fonts');`
    continue
  }
  if (line == `var getRect = function getRect(node) {`) {
    out += `var getRect = function getRect(node) { if (!_getBoundingClientRect.default(node)) return { height: 0, width: 0, top: 0, left: 0 }\n`
    continue
  }
  if (line == `      var x = left - relativeRect.left;`) {
    out += `if (!relativeRect) return\n`
  }
  out += `${line}\n`
}

fs.writeFileSync('./web-build/static/js/app.js', out)
