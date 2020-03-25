import React, { useState, useEffect, useRef, memo } from 'react'
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  TextProps,
  TextProperties,
  TextStyle,
} from 'react-native'
import { Restaurant } from '@dish/models'
import { HStack, VStack, ZStack, StackBaseProps } from '../shared/Stacks'
import { Spacer } from '../shared/Spacer'
import { TagButton } from './TagButton'
import { Link } from '../shared/Link'
import { useOvermind } from '../../state/om'
import { RatingView } from './RatingView'
import { RankingView } from './RankingView'
import { LinearGradient } from 'expo-linear-gradient'
import { Popover } from '../shared/Popover'
import { ArrowContainer } from 'react-tiny-popover'
import { Tooltip } from '../shared/Stack/Tooltip'
import { RestaurantRatingPopover } from './RestaurantRatingPopover'
import { Circle } from '../shared/Circle'
import { SmallTitle } from '../shared/SmallTitle'
import { Divider } from '../shared/Divider'

export const RestaurantListItem = ({
  restaurant,
  rank,
  onHover,
}: {
  restaurant: Restaurant
  rank: number
  onHover: (r: Restaurant) => void
}) => {
  const om = useOvermind()
  const [isHovered, setIsHovered] = useState(false)

  const [open_text, open_color, next_time] = openingHours(restaurant)
  const [price_label, price_color, price_range] = priceRange(restaurant)
  const [isMounted, setIsMounted] = useState(false)
  const photos = Restaurant.allPhotos(restaurant).slice(0, isMounted ? 10 : 1)
  const [disablePress, setDisablePress] = useState(false)

  useEffect(() => {
    let tm = setTimeout(() => {
      setIsMounted(true)
    }, Math.min(rank * 100, 2000))
    return () => {
      clearTimeout(tm)
    }
  }, [])

  return (
    <div
      style={{ position: 'relative' }}
      onMouseEnter={() => {
        onHover(restaurant)
        setIsHovered(true)
      }}
      onMouseLeave={() => {
        setIsHovered(false)
      }}
    >
      <TouchableOpacity
        disabled={disablePress}
        onPress={() => {
          om.actions.router.navigate({
            name: 'restaurant',
            params: { slug: restaurant.slug },
          })
        }}
      >
        <HStack
          alignItems="center"
          overflow="scroll"
          backgroundColor={isHovered ? '#B8E0F322' : 'transparent'}
        >
          <VStack padding={18} width="76%" maxWidth={525}>
            <Link name="restaurant" params={{ slug: restaurant.slug }}>
              <HStack alignItems="center">
                <RankingView rank={rank} />

                <Text
                  style={{
                    fontSize: 24,
                    fontWeight: 'bold',
                    textDecorationColor: 'transparent',
                  }}
                >
                  {restaurant.name}
                </Text>
              </HStack>
            </Link>

            <Spacer />

            <HStack>
              <HStack alignItems="center">
                <RestaurantRatingPopover
                  restaurant={restaurant}
                  onChangeOpen={(isOpen) => {
                    setDisablePress(isOpen)
                  }}
                />
                <Spacer />
                <TagButton rank={1} name="🍜 Pho" />
                <Spacer />
                <TagButton rank={22} name="🌃 Date Spot" />
                <Spacer />
                <Text style={{ opacity: 0.5 }}>+ 5 more</Text>
              </HStack>

              {/* <ZStack fullscreen>
                <LinearGradient
                  colors={['transparent', 'white']}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: '70%',
                    right: 0,
                    bottom: 0,
                  }}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                />
              </ZStack> */}
            </HStack>

            <Spacer />

            <Text style={{ opacity: 0.6, fontWeight: '500' }}>
              📍 3017 16th St. &nbsp;&nbsp; · &nbsp;&nbsp;{' '}
              <Link inline name="restaurant" params={{ slug: '' }}>
                Menu
              </Link>{' '}
              &nbsp;&nbsp; · &nbsp;&nbsp; 📞 &nbsp;&nbsp;
            </Text>

            <Spacer />

            <HStack paddingLeft={22} paddingRight={20}>
              <VStack width="30%" paddingRight="5%">
                <Text
                  numberOfLines={1}
                  style={{
                    fontWeight: 'bold',
                    color: open_color,
                    marginBottom: 3,
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
                    marginBottom: 3,
                  }}
                >
                  {price_label}
                </Text>
                <Text numberOfLines={1}>{price_range}</Text>
              </VStack>

              <VStack width="33%" paddingHorizontal="5%">
                <Text
                  numberOfLines={1}
                  style={{ fontWeight: 'bold', color: 'gray', marginBottom: 3 }}
                >
                  Delivers
                </Text>
                <Text numberOfLines={1}>Uber, PM, DD</Text>
              </VStack>
            </HStack>
          </VStack>

          <Spacer />

          <HStack>
            <VStack position="absolute" top={-20} left={-30} zIndex={100}>
              <RestaurantListItemRating restaurant={restaurant} />
            </VStack>

            {photos.slice(0, 3).map((photo, i) => {
              return (
                <React.Fragment key={i}>
                  <Image
                    source={{ uri: photo }}
                    style={{ width: 140, height: 140, borderRadius: 20 }}
                    resizeMode="cover"
                  />
                  <Spacer />
                </React.Fragment>
              )
            })}
          </HStack>
        </HStack>
      </TouchableOpacity>
    </div>
  )
}

export const EmojiButton = ({ active, children, onPress, ...rest }: any) => {
  return (
    <TouchableOpacity style={{ flex: 1 }} onPress={onPress}>
      <Circle
        size={88}
        backgroundColor={active ? 'yellow' : ''}
        borderColor={'#eee'}
        borderWidth={1}
        hoverStyle={{
          backgroundColor: active ? 'yellow' : 'rgba(0,0,0,0.05)',
        }}
      >
        <Text style={{ fontSize: 32 }}>{children}</Text>
      </Circle>
    </TouchableOpacity>
  )
}

const RestaurantListItemRating = memo(
  ({ restaurant }: { restaurant: Restaurant }) => {
    const [isHoveringRating, setIsHoveringRating] = useState(false)
    return (
      <Popover
        isOpen={isHoveringRating}
        position="right"
        target={
          <div
            onMouseEnter={() => {
              setIsHoveringRating(true)
            }}
            onMouseLeave={() => {
              setIsHoveringRating(false)
            }}
          >
            <RatingView restaurant={restaurant} />
          </div>
        }
      >
        <Tooltip height={300}>
          <VStack>
            <SmallTitle>Rating Summary</SmallTitle>

            <TableRow>
              <TableCell color="#555" fontWeight="600" width="50%">
                <Text>Source</Text>
              </TableCell>
              <TableCell color="#555" fontWeight="600" width="25%">
                <Text>Rating</Text>
              </TableCell>
              <TableCell color="#555" fontWeight="600" flex={1}>
                <Text>Weight</Text>
              </TableCell>
            </TableRow>

            {[
              { source: 'Yelp', rating: 4.5, weight: 0.5 },
              { source: 'Infatuated', rating: 4.0, weight: 0.85 },
              { source: 'TripAdvisor', rating: 4.8, weight: 0.35 },
            ].map((item) => (
              <TableRow key={item.source}>
                <TableCell fontWeight="bold" width="50%">
                  {item.source}
                </TableCell>
                <TableCell width="25%">{item.rating}</TableCell>
                <TableCell flex={1}>{item.weight}</TableCell>
              </TableRow>
            ))}
          </VStack>
        </Tooltip>
      </Popover>
    )
  }
)

function TableRow(props: StackBaseProps) {
  return <HStack {...props} />
}

function TableCell({
  color,
  fontSize,
  fontWeight,
  fontStyle,
  fontFamily,
  fontVariant,
  children,
  ...props
}: StackBaseProps & TextStyle) {
  return (
    <VStack paddingVertical={10} {...props}>
      <Text
        style={{
          color,
          fontSize,
          fontWeight,
          fontStyle,
          fontFamily,
          fontVariant,
        }}
      >
        {children}
      </Text>
    </VStack>
  )
}

const styles = StyleSheet.create({
  tableCell: {
    paddingVertical: 10,
  },
  tableCellText: {
    fontSize: 16,
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

function sources(restaurant: Restaurant) {
  const none = 'No sources yet'
  if (restaurant.sources == null) {
    return none
  }
  const count = Object.keys(restaurant.sources).length
  let text: string
  switch (count) {
    case 0:
      text = none
      break
    case 1:
      text = `1 source (${Object.keys(restaurant.sources)[0]})`
      break
    default:
      text = `${count} sources`
  }
  return text
}
