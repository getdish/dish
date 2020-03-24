import React, { useState, useEffect, useRef, memo } from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import { Restaurant } from '@dish/models'
import { HStack, VStack, ZStack } from '../shared/Stacks'
import { Spacer } from '../shared/Spacer'
import { TagButton } from './TagButton'
import { Link } from '../shared/Link'
import { useOvermind } from '../../state/om'
import { RatingView } from './RatingView'
import { RankingView } from './RankingView'
import { LinearGradient } from 'expo-linear-gradient'
import { Popover } from '../shared/Popover'
import { ArrowContainer } from 'react-tiny-popover'
import { Tooltip } from './Tooltip'

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
                <RestaurantRate restaurant={restaurant} />
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

const RestaurantRate = memo(({ restaurant }: { restaurant: Restaurant }) => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <Popover
      isOpen={isOpen}
      position="right"
      target={
        <TouchableOpacity
          onPress={() => {
            setIsOpen(!isOpen)
          }}
        >
          <div
            style={{
              filter: isOpen ? '' : 'grayscale(100%)',
              marginLeft: 20,
            }}
          >
            <Text style={{ fontSize: 24, opacity: isOpen ? 1 : 0.5 }}>⭐️</Text>
          </div>
        </TouchableOpacity>
      }
    >
      <Tooltip height={200}>
        <Text>{restaurant.name}</Text>
      </Tooltip>
    </Popover>
  )
})

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
        <Tooltip height={200}>
          <Text>Test me out</Text>
        </Tooltip>
      </Popover>
    )
  }
)

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
