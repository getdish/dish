import React from 'react'
import { Text } from 'react-native'
import { Restaurant } from '@dish/models'
import { HStack, VStack, StackBaseProps } from '../shared/Stacks'

export const RestaurantDetailRow = ({
  restaurant,
  ...rest
}: StackBaseProps & {
  restaurant: Restaurant
}) => {
  const [open_text, open_color, next_time] = openingHours(restaurant)
  const [price_label, price_color, price_range] = priceRange(restaurant)
  return (
    <HStack paddingLeft={22} paddingRight={20} {...rest}>
      <VStack width="30%" paddingRight="5%">
        <Text
          numberOfLines={1}
          style={{
            fontWeight: 'bold',
            color: open_color,
            marginBottom: 2,
          }}
        >
          {open_text}
        </Text>
        <Text numberOfLines={1}>{next_time}</Text>
      </VStack>

      <VStack width="33%" paddingHorizontal="5%">
        <Text
          numberOfLines={1}
          style={{
            fontWeight: 'bold',
            color: price_color,
            marginBottom: 2,
          }}
        >
          {price_label}
        </Text>
        <Text numberOfLines={1}>{price_range}</Text>
      </VStack>

      <VStack width="33%" paddingHorizontal="5%">
        <Text
          numberOfLines={1}
          style={{ fontWeight: 'bold', color: 'gray', marginBottom: 2 }}
        >
          Delivers
        </Text>
        <Text numberOfLines={1}>Uber, PM, DD</Text>
      </VStack>
    </HStack>
  )
}

function openingHours(restaurant: Restaurant) {
  let text = 'Opens at'
  let color = 'grey'
  let next_time = 'unknown'
  if (restaurant.is_open_now != null) {
    text = restaurant.is_open_now ? 'Open until' : 'Closed until'
    color = restaurant.is_open_now ? 'green' : 'red'
    const now = new Date()
    let day = now.getDay() - 1
    if (day == -1) {
      day = 6
    }
    // TODO: Tomorrow isn't always when the next opening time is.
    // Eg; when it's the morning and the restaurant opens in the evening.
    let tomorrow = day + 1
    if (tomorrow == 7) {
      tomorrow = 0
    }
    const opens_at = restaurant.hours[tomorrow].hoursInfo.hours[0]
      .replace(/"/g, '')
      .split(' - ')[0]
    const closes_at = restaurant.hours[day].hoursInfo.hours[0]
      .replace(/"/g, '')
      .split(' - ')[1]
    next_time = restaurant.is_open_now ? closes_at : opens_at
  }
  return [text, color, next_time]
}

function priceRange(restaurant: Restaurant) {
  let label = 'Price'
  let color = 'grey'
  let price_range = 'unknown'
  if (restaurant.price_range != null) {
    const [low, high] = restaurant.price_range
      .replace(/\$/g, '')
      .split(' - ')
      .map((i) => parseInt(i))
    const average = (low + high) / 2
    price_range = '~' + restaurant.price_range
    switch (true) {
      case average <= 10:
        label = 'Cheap'
        color = 'green'
        break
      case average > 10 && average <= 30:
        label = 'Average'
        color = 'orange'
        break
      case average > 30:
        label = 'Expensive'
        color = 'red'
        break
    }
  }
  return [label, color, price_range]
}
