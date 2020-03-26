import React, { useState, useEffect, useRef, memo } from 'react'
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  TextProps,
  TextProperties,
} from 'react-native'
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
import { Tooltip } from '../shared/Stack/Tooltip'
import { RestaurantRatingPopover } from './RestaurantRatingPopover'
import { Circle } from '../shared/Circle'
import { SmallTitle } from '../shared/SmallTitle'
import { Divider } from '../shared/Divider'
import { TableRow, TableCell } from './TableRow'
import { RestaurantDetailRow } from './RestaurantDetailRow'

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
              <HStack alignItems="center" marginVertical={-2}>
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
              <Spacer size={20} />
              <HStack alignItems="center">
                <RestaurantRatingPopover
                  restaurant={restaurant}
                  onChangeOpen={setDisablePress}
                />
                <Spacer />
                <RestaurantTagsRow showMore restaurant={restaurant} />
              </HStack>
            </HStack>
            <Spacer />
            <RestaurantMetaRow restaurant={restaurant} />
            <Spacer />
            <RestaurantDetailRow restaurant={restaurant} />
          </VStack>

          <Spacer />

          <HStack>
            <VStack position="absolute" top={-20} left={-30} zIndex={100}>
              <RestaurantRatingDetail restaurant={restaurant} />
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

export const RestaurantMetaRow = ({
  restaurant,
}: {
  restaurant: Restaurant
}) => {
  return (
    <HStack alignItems="center">
      <Text style={{ opacity: 0.6, fontWeight: '500' }}>
        📍 3017 16th St. &nbsp; · &nbsp;{' '}
        <Link inline name="restaurant" params={{ slug: '' }}>
          Menu
        </Link>{' '}
        &nbsp; · &nbsp; 📞 &nbsp;
      </Text>
      {/* <Divider flex /> */}
    </HStack>
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

export const RestaurantTagsRow = ({
  restaurant,
  showMore,
}: {
  restaurant: Restaurant
  showMore?: boolean
}) => {
  const tags = restaurant.tags.map((i) => i.taxonomy.name) ?? []
  return (
    <HStack alignItems="center" spacing>
      {tags.slice(0, showMore ? 2 : 10).map((tag) => (
        <TagButton key={tag} rank={1} name={`🍜 ${tag}`} />
      ))}
      {!!showMore && <Text style={{ opacity: 0.5 }}>+ 5 more</Text>}
    </HStack>
  )
}

export const RestaurantRatingDetail = memo(
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
