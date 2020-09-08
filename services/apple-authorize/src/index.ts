import bodyParser from 'body-parser'
import express from 'express'
import fetch from 'node-fetch'

const app = express()

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))

const PORT = process.env.PORT || 6155

app.post('*', async (req, res) => {
  try {
    const body = req.body
    console.log('got payload', body)
    console.log('got', body.code)
    console.log('got', body.id_token)
    console.log('got', body.state)
    console.log('got', body.user)

    console.log('got', body.error)
    // see https://developer.apple.com/documentation/sign_in_with_apple/sign_in_with_apple_js/configuring_your_webpage_for_sign_in_with_apple

    res.send
  } catch (error) {
    res.send('Error: ' + error.message)
  }
})

app.listen(PORT, () => {
  console.log(`Dish Hooks server started at http://localhost:${PORT}`)
})
