import app from './app'

//
;(async () => {
  const server = await app()
  server.listen(3000, () => {
    console.log('Server started on port 3000!')
  })
})()
