import 'reflect-metadata'
import '@dish/helpers/polyfill'

import app from './app'

const PORT = process.env.PORT || 3000

async function main() {
  try {
    const server = await app()
    console.log('got app', server)
    server.listen(PORT, () => {
      console.log('Server started on port ' + PORT)
    })
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

main()
