import { Yelp } from './Yelp'

async function one() {
  const range = 0.001
  const name = 'Little Heaven'
  const coords = [37.75948, -122.41943]
  const t = new Yelp()
  await t.getRestaurants({
    top_right: [coords[0] - range, coords[1] - range],
    bottom_left: [coords[0] + range, coords[1] + range],
    start: 0,
    onlyRestaurant: { name, address: 'noop', telephone: 'noop' },
  })
}

one()
