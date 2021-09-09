import { route } from '@dish/api'

import countriesJSON from './_countries.json'

export default route((_, res) => {
  res.send(countriesJSON)
})
