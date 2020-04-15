import { Restaurant } from '@dish/models'
import React, { memo } from 'react'
import { StyleSheet, Text } from 'react-native'

import { Divider } from '../ui/Divider'
import { Spacer } from '../ui/Spacer'
import { HStack, StackBaseProps, VStack } from '../ui/Stacks'
import { RestaurantFavoriteStar } from './RestaurantFavoriteStar'
import { RestaurantTagsRow } from './RestaurantTagsRow'

export const RestaurantDetailRow = memo(
  ({
    restaurant,
    size,
    centered,
    ...rest
  }: StackBaseProps & {
    size?: 'sm' | 'md'
    restaurant: Restaurant
    centered?: boolean
  }) => {
    const isSm = size === 'sm'

    const [open_text, open_color, next_time] = openingHours(restaurant)
    const [price_label, price_color, price_range] = priceRange(restaurant)

    const rows = [
      { title: open_text, content: next_time, color: open_color },
      { title: price_label, content: price_range, color: price_color },
      { title: 'Delivers', content: 'Uber, PostMates', color: 'gray' },
    ]

    const spaceSize = '6%'

    const titleEl = (title: string) => (
      <Text
        numberOfLines={1}
        style={{
          textAlign: centered ? 'center' : 'left',
          fontWeight: '600',
          fontSize: 14,
          color: open_color,
          marginBottom: 3,
        }}
      >
        {title}
      </Text>
    )

    const contentEl = (content: string) => (
      <Text
        numberOfLines={1}
        style={[styles.subText, centered && { textAlign: 'center' }]}
      >
        {content}
      </Text>
    )

    return (
      <HStack
        paddingHorizontal={20}
        alignItems="center"
        spacing={spaceSize}
        {...rest}
      >
        {rows.map((row, index) => (
          <React.Fragment key={row.title}>
            <VStack>
              {titleEl(row.title)}
              {contentEl(row.content)}
            </VStack>
            {index !== rows.length - 1 && (
              <>
                <Spacer size={spaceSize} />
                <Divider vertical height={25} />
              </>
            )}
          </React.Fragment>
        ))}

        <RestaurantFavoriteStar restaurant={restaurant} />
        <RestaurantTagsRow showMore restaurant={restaurant} />
      </HStack>
    )
  }
)

const styles = StyleSheet.create({
  subText: {
    fontSize: 13,
  },
})

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
