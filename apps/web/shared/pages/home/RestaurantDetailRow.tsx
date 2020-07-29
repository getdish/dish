import { RestaurantQuery, graphql } from '@dish/graph'
import { Divider, HStack, Spacer, StackProps, Text, VStack } from '@dish/ui'
import React, { memo } from 'react'

import { RestaurantDeliveryButtons } from './RestaurantDeliveryButtons'
import { useRestaurantQuery } from './useRestaurantQuery'

function openingHours(restaurant: RestaurantQuery) {
  if (restaurant.hours() == null) {
    return ['Uknown Hours', 'grey', '']
  }
  let text = 'Opens at'
  let color = 'grey'
  let next_time = ''
  if (restaurant.is_open_now != null) {
    text = restaurant.is_open_now ? 'Opens at' : 'Closed'
    color = restaurant.is_open_now ? '#33aa99' : '#999'
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
    const openHour = restaurant.hours()[tomorrow]?.hoursInfo.hours[0] ?? ''
    const closesHour = restaurant.hours()[day]?.hoursInfo.hours[0] ?? ''

    if (openHour && closesHour) {
      const opens_at = openHour
        .replace(/"/g, '')
        .replace(' am', 'am')
        .replace(' pm', 'pm')
        .split('-')[0]
      const closes_at = closesHour
        .replace(/"/g, '')
        .replace(' am', 'am')
        .replace(' pm', 'pm')
        .split('-')[1]

      next_time = `${opens_at} - ${closes_at}`
    }

    // next_time = (restaurant.is_open_now ? closes_at : opens_at) || '~'
  }
  return [text, color, next_time]
}

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
      const sizeSm = size === 'sm'
      const restaurant = useRestaurantQuery(restaurantSlug)
      const [open_text, open_color, next_time] = openingHours(restaurant)
      const [price_label, price_color, price_range] = priceRange(restaurant)

      const rows = [
        { title: open_text, content: next_time, color: open_color },
        { title: price_label, content: price_range, color: price_color },
      ]

      if (size !== 'sm') {
        rows.push({
          title: 'Delivers',
          // @ts-ignore
          content: (
            <RestaurantDeliveryButtons restaurantSlug={restaurantSlug} />
          ),
          color: 'gray',
        })
      }

      const spaceSize = sizeSm ? 0 : '6%'

      return (
        <HStack
          alignItems="center"
          spacing={spaceSize}
          overflow="visible"
          {...rest}
        >
          {rows
            .filter((x) => !sizeSm || x.content !== '')
            .map((row, index) => (
              <HStack
                flex={1}
                {...(sizeSm && {
                  paddingHorizontal: 10,
                })}
                key={`${index}${row.title}`}
              >
                <VStack
                  {...(sizeSm && {
                    flexDirection: 'row',
                    alignItems: 'center',
                  })}
                  {...(!sizeSm && { flex: 10 })}
                >
                  {!sizeSm && (
                    <Text
                      ellipse
                      textAlign={centered ? 'center' : 'left'}
                      fontWeight="600"
                      fontSize={14}
                      color={row.color ?? ''}
                      marginBottom={3}
                    >
                      {row.title}
                    </Text>
                  )}
                  <Text
                    ellipse
                    fontSize={sizeSm ? 12 : 13}
                    textAlign={centered ? 'center' : 'left'}
                    color={sizeSm ? row.color ?? '' : 'inherit'}
                    margin="auto"
                    minHeight={24}
                  >
                    {row.content !== '' ? row.content : sizeSm ? '' : '~'}
                  </Text>
                </VStack>
                {after}
                {!sizeSm && index !== rows.length - 1 && (
                  <>
                    <Spacer size="xl" />
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

// @tombh: I seem to have got confused about the type of this field.
// Is it a numerical price range or just a $$$-style?? I need to go
// into the crawlers and sort it out. But for now let's support both.
function priceRange(restaurant: RestaurantQuery) {
  if (restaurant.price_range == null) {
    return ['Price', 'grey', '']
  }
  if (/\d/.test(restaurant.price_range)) {
    return priceRangeNumeric(restaurant)
  }
  if (restaurant.price_range.includes('$')) {
    return priceRangeDollar(restaurant)
  }
  return ['Price', 'grey', '']
}

function priceRangeDollar(restaurant: RestaurantQuery) {
  let label = 'Price'
  let color = 'grey'
  switch (true) {
    case restaurant.price_range == '$':
      label = 'Cheap'
      color = '#000'
      break
    case restaurant.price_range == '$$':
      label = 'Price'
      color = '#888'
      break
    case restaurant.price_range == '$$$':
      label = 'Expensive'
      color = '#ccc'
      break
  }
  return [label, color, restaurant.price_range]
}

function priceRangeNumeric(restaurant: RestaurantQuery) {
  let label = 'Price'
  let color = 'grey'
  let price_range = ''
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
  return [label, color, price_range]
}
