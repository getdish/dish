import { route } from '@dish/api'

const countriesJSON = require('./_countries.json')

export default route((_, res) => {
  res.send(countriesJSON)
})
