import { RestaurantQuery, graphql } from '@dish/graph'
import { Divider, HStack, Spacer, StackProps, Text, VStack } from '@dish/ui'
import React, { memo } from 'react'

import { SmallButton, SmallLinkButton } from '../../views/ui/SmallButton'
import { RestaurantDeliveryButtons } from './RestaurantDeliveryButtons'
import { useRestaurantQuery } from './useRestaurantQuery'

const getDayOfWeek = () => {
  const day = new Date().getDay() - 1
  return day == -1 ? 6 : day
}

function openingHours(restaurant: RestaurantQuery) {
  if (restaurant.hours() == null) {
    return ['Unknown Hours', 'grey', '']
  }

  let text = 'Closed'
  let color = '#999'
  let next_time = ''

  if (restaurant.is_open_now != null) {
    text = restaurant.is_open_now ? 'Open' : 'Closed'
    color = restaurant.is_open_now ? '#33aa99' : '#999'

    const dayOfWeek = getDayOfWeek()
    // TODO: Tomorrow isn't always when the next opening time is.
    // Eg; when it's the morning and the restaurant opens in the evening.
    const tomorrow = (dayOfWeek + 1) % 7
    const tomorrowsHours =
      restaurant.hours()[tomorrow]?.hoursInfo.hours[0] ?? ''
    const todaysHours = restaurant.hours()[dayOfWeek]?.hoursInfo.hours[0] ?? ''

    const getHours = (hours: string) => {
      const [opens, closes] = hours.split(' - ')
      if (opens && closes) {
        const opens_at = opens.replace(' ', '').replace(':00', '')
        const closes_at = closes.replace(' ', '').replace(':00', '')
        return `${opens_at} - ${closes_at}`
      }
      return ''
    }

    if (restaurant.is_open_now) {
      text = 'Open'
      color = '#33aa99'
      next_time = getHours(todaysHours)
    } else {
      next_time = getHours(tomorrowsHours)
    }
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
        {
          title: open_text,
          content: (
            <SmallLinkButton
              name="restaurantHours"
              params={{ slug: restaurantSlug }}
              fontWeight="400"
            >
              {next_time}
            </SmallLinkButton>
          ),
          color: open_color,
        },
        { title: price_label, content: price_range, color: price_color },
      ]

      if (size !== 'sm') {
        rows.push({
          title: 'Order Delivery',
          // @ts-ignore
          content: (
            <RestaurantDeliveryButtons
              showLabels
              restaurantSlug={restaurantSlug}
            />
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
                    fontSize={sizeSm ? 14 : 16}
                    textAlign={centered ? 'center' : 'left'}
                    color={sizeSm ? row.color ?? '' : 'inherit'}
                    margin="auto"
                    paddingHorizontal={4} // prevents cutoff of image
                  >
                    {row.content !== '' ? row.content : sizeSm ? '' : '~'}
                  </Text>
                </VStack>
                {after}
                {!sizeSm && index !== rows.length - 1 && (
                  <>
                    {/* <Spacer size="xl" /> */}
                    {/* <Divider vertical height={25} /> */}
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
