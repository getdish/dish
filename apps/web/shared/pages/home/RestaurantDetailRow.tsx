import { RestaurantQuery, graphql } from '@dish/graph'
import { Divider, HStack, StackProps, Text, VStack } from '@dish/ui'
import React, { memo } from 'react'

import { RestaurantDeliveryButton } from './RestaurantDeliveryButton'
import { useRestaurantQuery } from './useRestaurantQuery'

export const RestaurantDetailRow = memo(
  graphql(
    ({
      restaurantSlug,
      size,
      centered,
      after,
      ...rest
    }: StackProps & {
      size?: 'sm' | 'md'
      restaurantSlug: string
      centered?: boolean
      after?: any
    }) => {
      const isSm = size === 'sm'
      const restaurant = useRestaurantQuery(restaurantSlug)
      const [open_text, open_color, next_time] = openingHours(restaurant)
      const [price_label, price_color, price_range] = priceRange(restaurant)

      const rows = [
        { title: open_text, content: next_time, color: open_color },
        { title: price_label, content: price_range, color: price_color },
        !isSm && {
          title: 'Delivers',
          content: (
            <RestaurantDeliveryButton inline restaurantSlug={restaurantSlug} />
          ),
          color: 'gray',
        },
      ].filter(Boolean)

      const spaceSize = isSm ? 0 : '6%'

      return (
        <HStack
          alignItems="center"
          spacing={spaceSize}
          overflow="visible"
          {...rest}
        >
          {rows
            .filter((x) => !isSm || x.content !== '')
            .map((row, index) => (
              <HStack
                {...(!isSm && { width: '32%' })}
                {...(isSm && {
                  paddingHorizontal: 10,
                  overflow: 'visible',
                })}
                key={`${index}${row.title}`}
              >
                <VStack
                  {...(isSm && { flexDirection: 'row', alignItems: 'center' })}
                  {...(!isSm && { flex: 10 })}
                >
                  {!isSm && (
                    <Text
                      ellipse
                      textAlign={centered ? 'center' : 'left'}
                      fontWeight="600"
                      fontSize={14}
                      color={row.color}
                      marginBottom={3}
                    >
                      {row.title}
                    </Text>
                  )}
                  <Text
                    fontSize={isSm ? 12 : 13}
                    textAlign={centered ? 'center' : 'left'}
                    color={isSm ? row.color : 'inherit'}
                  >
                    {row.content !== '' ? row.content : isSm ? '' : '~'}
                  </Text>
                </VStack>
                {after}
                {!isSm && index !== rows.length - 1 && (
                  <>
                    <Divider vertical height={25} />
                  </>
                )}
              </HStack>
            ))}
        </HStack>
      )
    }
  )
)

function openingHours(restaurant: RestaurantQuery) {
  let text = 'Opens at'
  let color = 'grey'
  let next_time = ''
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
    const opens_at = (restaurant.hours[tomorrow]?.hoursInfo.hours[0] ?? '')
      .replace(/"/g, '')
      .split('-')[0]
    const closes_at = (restaurant.hours[day]?.hoursInfo.hours[0] ?? '')
      .replace(/"/g, '')
      .split('-')[1]
    next_time = (restaurant.is_open_now ? closes_at : opens_at) || '~'
  }
  return [text, color, next_time]
}

function priceRange(restaurant: RestaurantQuery) {
  let label = 'Price'
  let color = 'grey'
  let price_range = ''
  if (restaurant.price_range != null) {
    const [low, high] = `${restaurant.price_range}`
      .replace(/\$/g, '')
      .split('-')
      .map((i) => parseInt(i))
    const average = (low + high) / 2
    price_range = restaurant.price_range
    switch (true) {
      case average <= 10:
        label = 'Cheap'
        color = '#000'
        break
      case average > 10 && average <= 30:
        label = 'Average'
        color = '#888'
        break
      case average > 30:
        label = 'Expensive'
        color = '#ccc'
        break
    }
  }
  return [label, color, price_range]
}
