import { Restaurant, Sources } from '@dish/models'
import React, { memo } from 'react'
import { Linking, StyleSheet, Text } from 'react-native'

import { Divider } from '../ui/Divider'
import { Spacer } from '../ui/Spacer'
import { HStack, StackProps, VStack } from '../ui/Stacks'
import { RestaurantFavoriteStar } from './RestaurantFavoriteStar'
import { RestaurantTagsRow } from './RestaurantTagsRow'

export const RestaurantDetailRow = memo(
  ({
    restaurant,
    size,
    centered,
    after,
    ...rest
  }: StackProps & {
    size?: 'sm' | 'md'
    restaurant: Restaurant
    centered?: boolean
    after?: any
  }) => {
    const isSm = size === 'sm'

    const [open_text, open_color, next_time] = openingHours(restaurant)
    const [price_label, price_color, price_range] = priceRange(restaurant)

    const rows = [
      { title: open_text, content: next_time, color: open_color },
      { title: price_label, content: price_range, color: price_color },
      {
        title: 'Delivers',
        content: deliveryLinks(restaurant.sources),
        color: 'gray',
      },
    ]

    const spaceSize = isSm ? 0 : '6%'

    type Item = typeof rows[0]

    const titleEl = ({ title, color }: Item) => (
      <Text
        numberOfLines={1}
        style={{
          textAlign: centered ? 'center' : 'left',
          fontWeight: '600',
          fontSize: 14,
          color,
          marginBottom: 3,
        }}
      >
        {title}
      </Text>
    )

    const contentEl = ({ color, content }: Item) => (
      <Text
        numberOfLines={1}
        style={[
          styles.subText,
          centered && { textAlign: 'center' },
          isSm && {
            color,
          },
        ]}
      >
        {content}
      </Text>
    )

    return (
      <HStack flex={1} alignItems="center" spacing={spaceSize} {...rest}>
        {rows.map((row, index) => (
          <HStack {...(!isSm && { width: '32%' })} key={`${index}${row.title}`}>
            <VStack
              {...(isSm && { flexDirection: 'row', alignItems: 'center' })}
              flex={10}
            >
              {!isSm && titleEl(row)}
              {contentEl(row)}
            </VStack>
            {after}
            {isSm && index !== rows.length - 1 && (
              <>
                <Spacer flex={0.5} />
                <Divider vertical height={25} />
                <Spacer flex={0.5} />
              </>
            )}
          </HStack>
        ))}
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
    text = restaurant.is_open_now ? 'Opens at' : 'Closed until'
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
      .split('-')[0]
    const closes_at = restaurant.hours[day].hoursInfo.hours[0]
      .replace(/"/g, '')
      .split('-')[1]
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
      .split('-')
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

function deliveryLinks(sources: Sources) {
  const empty = <Text>~</Text>
  if (!sources) return empty
  const delivery_sources = ['ubereats']
  let count = 0
  const delivers = Object.keys(sources)
    .map((source, index) => {
      if (!delivery_sources.includes(source)) return
      count++
      const name = source.charAt(0).toUpperCase() + source.slice(1)
      return (
        <Text key={index}>
          <Text
            style={{
              color: 'blue',
            }}
            onPress={() => Linking.openURL(sources[source].url)}
          >
            🔗 {name}
          </Text>
          {count > 1 && <Text>, </Text>}
        </Text>
      )
    })
    .filter((i) => i != null)
  return delivers.length > 0 ? delivers : empty
}
