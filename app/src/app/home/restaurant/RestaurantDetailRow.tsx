import { RestaurantQuery, graphql } from '@dish/graph'
import React, { memo } from 'react'
import { HStack, StackProps, Text, VStack } from 'snackui'

import { isWeb } from '../../../constants/constants'
import { queryRestaurant } from '../../../queries/queryRestaurant'
import { Link } from '../../views/Link'
import { RestaurantDeliveryButtons } from './RestaurantDeliveryButtons'

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
      const [restaurant] = queryRestaurant(restaurantSlug)
      if (!restaurant) {
        return null
      }
      // const restaurantSources = getRestaurantDeliverySources(
      //   restaurant.sources()
      // )
      const open = openingHours(restaurant)
      const [price_label, price_color, price_range] = priceRange(restaurant)

      const rows = [
        {
          title: open.text,
          content: open.nextTime ? (
            <Link
              className="underline-link"
              name="restaurantHours"
              params={{ slug: restaurantSlug }}
              color={open.color}
              ellipse
            >
              {open.nextTime}
            </Link>
          ) : (
            'No hours :('
          ),
          color: open.color,
        },
        { title: price_label, content: price_range, color: price_color },
      ]

      if (size !== 'sm') {
        rows.push({
          title: 'Delivery',
          // @ts-ignore
          content: <RestaurantDeliveryButtons showLabels restaurantSlug={restaurantSlug} />,
          color: 'gray',
        })
      }

      const spaceSize = sizeSm ? 0 : '6%'

      return (
        <HStack alignItems="center" spacing={spaceSize} overflow="visible" {...rest}>
          {rows
            .filter((x) => !sizeSm || x.content !== '')
            .map((row, index) => (
              <HStack
                flex={1}
                width="33%"
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
                  <VStack
                    {...(!sizeSm && {
                      minHeight: 34,
                      alignItems: 'center',
                      justifyContent: 'center',
                    })}
                  >
                    <Text
                      ellipse
                      fontSize={sizeSm ? 14 : 16}
                      textAlign={centered ? 'center' : 'left'}
                      color={sizeSm ? row.color ?? '' : isWeb ? 'inherit' : '#999'}
                      margin="auto"
                      paddingHorizontal={4} // prevents cutoff of image
                    >
                      {row.content !== '' ? row.content : sizeSm ? '' : '~'}
                    </Text>
                  </VStack>
                </VStack>
                {after}
              </HStack>
            ))}
        </HStack>
      )
    }
  )
)

const getDayOfWeek = () => {
  const day = new Date().getDay() - 1
  return day == -1 ? 6 : day
}

export function openingHours(restaurant: RestaurantQuery) {
  if (restaurant.hours == null) {
    return {
      text: '',
      color: '#999',
      nextTime: '',
      isOpen: false,
    }
  }

  const isOpen = !!restaurant.is_open_now
  let text = isOpen ? 'Open' : 'Closed'
  let color = isOpen ? '#337777' : '#999'
  let nextTime = ''
  const dayOfWeek = getDayOfWeek()

  if (isOpen) {
    const todaysHours = restaurant.hours[dayOfWeek]?.hoursInfo.hours[0] ?? ''
    nextTime = getHours(todaysHours)
  } else {
    // TODO: Tomorrow isn't always when the next opening time is.
    // Eg; when it's the morning and the restaurant opens in the evening.
    const tomorrow = (dayOfWeek + 1) % 7
    const tomorrowsHours = restaurant.hours[tomorrow]?.hoursInfo.hours[0] ?? ''
    nextTime = getHours(tomorrowsHours)
  }

  return {
    text,
    color,
    nextTime,
    isOpen,
  }
}

const getHours = (hours: string) => {
  const [opens, closes] = hours.split(' - ')
  if (opens && closes) {
    let opens_at = opens.replace(' ', '').replace(':00', '')
    let closes_at = closes.replace(' ', '').replace(':00', '')
    const opensPm = opens_at.includes('pm')
    const closesPm = closes_at.includes('pm')
    const opensAm = opens_at.includes('am')
    const closesAm = closes_at.includes('am')
    const opensMorningClosesNight = opensAm && closesPm
    if ((opensPm && closesPm) || opensMorningClosesNight) {
      opens_at = opens_at.replace('pm', '')
    }
    if ((opensAm && closesAm) || opensMorningClosesNight) {
      opens_at = opens_at.replace('am', '')
    }
    return `${opens_at}-${closes_at}`
  }
  return ''
}

export function priceRange(restaurant: RestaurantQuery) {
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
      color = '#aaa'
      break
    case restaurant.price_range == '$$':
      label = 'Price'
      color = '#aaa'
      break
    case restaurant.price_range == '$$$':
      label = 'Expensive'
      color = '#aaa'
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
  price_range = restaurant.price_range ?? ''
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