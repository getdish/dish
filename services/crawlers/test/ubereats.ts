import test from 'ava'

import { UberEats } from '../src/ubereats/UberEats'
import { Restaurant, Dish } from '@dish/models'

async function getEmpanada() {
  const ue = new UberEats()
  await ue.getRestaurant('03b6b762-fc01-4547-a81f-87bb7af42c6a')
  const restaurant = new Restaurant()
  await restaurant.findOne('name', "Empanada Mama - Hell's Kitchen")
  return restaurant
}

test('gets and persists a restaurant and its dishes', async t => {
  const empanada = await getEmpanada()
  t.is(empanada.address, '765 9th Ave, New York, NY 10019')
  t.assert(empanada.dishes.length > 50)
  const names = empanada.dishes.map((dish: any) => {
    return dish.name
  })
  t.assert(names.includes('Passion Goya Bottle'))
})
