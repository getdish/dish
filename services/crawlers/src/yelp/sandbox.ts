import { Yelp } from './Yelp'

async function one() {
  const range = 0.001
  const name = 'El Gran Taco Loco'
  const coords = [37.724785825308835, -122.43457046597929]
  const t = new Yelp()
  await t.getRestaurants({
    top_right: [coords[0] - range, coords[1] - range],
    bottom_left: [coords[0] + range, coords[1] + range],
    start: 0,
    onlyRestaurant: { name, address: 'noop', telephone: 'noop' },
  })
}

one()
