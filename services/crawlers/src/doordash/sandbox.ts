import { restaurantFindOne } from '@dish/graph'

import { DoorDash } from './DoorDash'

async function main() {
  const dd = new DoorDash()
  await dd.runOnWorker('allForCity', ['San Francisco, CA'])
}

async function one() {
  const range = 0.001
  const name = 'Solstice'
  const coords = [37.797519, -122.4314282]
  const t = new DoorDash()
  //const restaurant = await restaurantFindOne({ name })
  //console.log('restaurant', restaurant)
}

main()
