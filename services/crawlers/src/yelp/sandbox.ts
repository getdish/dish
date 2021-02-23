import { Yelp } from './Yelp'

async function one() {
  try {
    const range = 0.001
    const name = 'Little Heaven'
    const coords = [37.75948, -122.41943]
    const t = new Yelp()
    await t.getRestaurants(
      [coords[0] - range, coords[1] - range],
      [coords[0] + range, coords[1] + range],
      0,
      name
    )
  } catch (err) {
    console.error(err.message, err.stack)
  }
}

one()
