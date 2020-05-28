import { MenuItem, Restaurant } from '../../src'

export const restaurant_fixture: Restaurant = {
  name: 'Test Restaurant',
  description: 'Not a real restaurant :(',
  location: {
    type: 'Point',
    coordinates: [0, 50],
  },
  address: 'No 1 Non-existent Street',
  city: 'Mars',
  state: 'Denial',
  zip: 123,
  image: 'https://imgur.com/123abc',
  // @ts-ignore
  hours: [
    { hoursInfo: { hours: ['11:00 am - 8:30 pm'] } },
    { hoursInfo: { hours: ['11:00 am - 8:30 pm'] } },
    { hoursInfo: { hours: ['11:00 am - 8:30 pm'] } },
    { hoursInfo: { hours: ['11:00 am - 8:30 pm'] } },
    { hoursInfo: { hours: ['11:00 am - 8:30 pm'] } },
    { hoursInfo: { hours: ['11:00 am - 8:30 pm'] } },
    { hoursInfo: { hours: ['11:00 am - 8:30 pm'] } },
  ],
}

export const menu_item_fixture: MenuItem = {
  name: 'Test Dish',
  description: 'Not a real dish :(',
  price: 123,
  image: 'https://imgur.com/123abc',
}
