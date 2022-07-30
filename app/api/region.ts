import { getSqlFile } from './_helpers'
import { route } from '@dish/api'
import { main_db } from '@dish/helpers-node'
import { capitalize } from 'lodash'

export default route(async (req, res) => {
  const regionsSQL = await getSqlFile('regions.sql')
  const slug = req.query['slug'] ?? ''
  const { rows } = await main_db.query(regionsSQL, [slug])
  const data = rows[0]?.json_build_object
  if (data) {
    // handle poor formatting
    if (data.name[2] === '-' && data.name[3] === ' ') {
      data.name = data.name.slice(3).trim()
    }
    // handle poor formatting
    if (data.name.toUpperCase() === data.name) {
      data.name = data.name
        .split(' ')
        .map((x) => capitalize(x))
        .join(' ')
    }
    console.log('data', data)
    res.send(data)
  } else {
    res.sendStatus(500)
  }
})
