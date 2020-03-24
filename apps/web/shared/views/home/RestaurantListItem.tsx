import React, { useState, useEffect } from 'react'
import { Image, Text, TouchableOpacity } from 'react-native'
import { Restaurant } from '@dish/models'
import { HStack, VStack, ZStack } from '../shared/Stacks'
import { Spacer } from '../shared/Spacer'
import { TagButton } from './TagButton'
import { Link } from '../shared/Link'
import { useOvermind } from '../../state/om'
import { RatingView } from './RatingView'
import { RankingView } from './RankingView'

export function RestaurantListItem({
  restaurant,
  rank,
  onHover,
}: {
  restaurant: Restaurant
  rank: number
  onHover: (r: Restaurant) => void
}) {
  const om = useOvermind()
  const [isHovered, setIsHovered] = useState(false)

  const [open_text, open_color, next_time] = openingHours(restaurant)
  const [price_label, price_color, price_range] = priceRange(restaurant)
  const [isMounted, setIsMounted] = useState(false)
  const photos = restaurant.allPhotos.slice(0, isMounted ? 10 : 1)

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
          backgroundColor={isHovered ? '#B8E0F355' : 'transparent'}
        >
          <VStack padding={18} width="70%" maxWidth={525}>
            <Link name="restaurant" params={{ slug: restaurant.slug }}>
              <HStack alignItems="center">
                <RankingView rank={rank} />

                <Text
                  style={{
                    fontSize: 22,
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
              <HStack>
                <TagButton rank={1} name="🍜 Pho" />
                <Spacer />
                <TagButton rank={22} name="🌃 Date Spot" />
                <Spacer />
                <TagButton rank={30} name="🥬 Vegan" />
                <Spacer />
                <TagButton rank={120} name="🥢 Asian" />
              </HStack>
            </HStack>

            <Spacer />

            <Text style={{ opacity: 0.5 }}>
              3017 16th St · Menu · Quick bites, Mexican, Fast Food
            </Text>

            <Spacer />

            <HStack>
              <VStack paddingRight={10}>
                <Text style={{ fontWeight: 'bold', color: open_color }}>
                  {open_text}
                </Text>
                <Text>{next_time}</Text>
              </VStack>

              <VStack paddingHorizontal={10}>
                <Text style={{ fontWeight: 'bold', color: price_color }}>
                  {price_label}
                </Text>
                <Text>{price_range}</Text>
              </VStack>

              <VStack paddingHorizontal={10}>
                <Text style={{ fontWeight: 'bold', color: 'gray' }}>
                  Delivers
                </Text>
                <Text>Uber, Postmates, Doordash</Text>
              </VStack>
            </HStack>
          </VStack>

          <HStack>
            <VStack position="absolute" top={-20} left={-30} zIndex={100}>
              <RatingView restaurant={restaurant} />
            </VStack>

            {photos.slice(0, 3).map((photo, i) => {
              return (
                <React.Fragment key={i}>
                  <Image
                    source={{ uri: photo }}
                    style={{ width: 130, height: 130, borderRadius: 20 }}
                    resizeMode="cover"
                  />
                  <Spacer size="lg" />
                </React.Fragment>
              )
            })}
          </HStack>
        </HStack>
      </TouchableOpacity>
    </div>
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
  let label = 'Price Range'
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
