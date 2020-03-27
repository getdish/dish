import React, { useState, useEffect, memo } from 'react'
import { Image, Text, TouchableOpacity } from 'react-native'
import { Restaurant } from '@dish/models'
import { HStack, VStack } from '../shared/Stacks'
import { Spacer } from '../shared/Spacer'
import { TagButton } from './TagButton'
import { Link } from '../shared/Link'
import { useOvermind } from '../../state/om'
import { RatingView } from './RatingView'
import { RankingView } from './RankingView'
import { Popover } from '../shared/Popover'
import { Tooltip } from '../shared/Stack/Tooltip'
import { RestaurantRatingPopover } from './RestaurantRatingPopover'
import { Circle } from '../shared/Circle'
import { SmallTitle } from '../shared/SmallTitle'
import { TableRow, TableCell } from './TableRow'
import { RestaurantDetailRow } from './RestaurantDetailRow'
import { RestaurantMetaRow } from './RestaurantMetaRow'

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

            <HStack marginVertical={-7}>
              <Spacer size={20} />
              <HStack alignItems="center">
                <RestaurantRatingPopover restaurant={restaurant} />
                <Spacer />
                <RestaurantTagsRow showMore restaurant={restaurant} />
              </HStack>
            </HStack>

            <Spacer />

            <HStack alignItems="center" paddingLeft={22}>
              <RestaurantMetaRow restaurant={restaurant} />
              {/* <Divider flex /> */}
            </HStack>
            <Spacer size="sm" />
            <RestaurantDetailRow size="sm" restaurant={restaurant} />
          </VStack>

          <Spacer size="lg" />

          <HStack>
            <VStack position="absolute" top={-14} left={-30} zIndex={100}>
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

export const EmojiButton = ({
  active,
  children,
  onPress,
  size = 88,
  ...rest
}: any) => {
  return (
    <TouchableOpacity style={{ flex: 1 }} onPress={onPress}>
      <Circle
        size={size}
        backgroundColor={active ? 'yellow' : ''}
        borderColor={'#eee'}
        borderWidth={1}
        hoverStyle={{
          backgroundColor: active ? 'yellow' : 'rgba(0,0,0,0.05)',
        }}
      >
        <Text style={{ fontSize: size * 0.45 }}>{children}</Text>
      </Circle>
    </TouchableOpacity>
  )
}

export const RestaurantTagsRow = ({
  restaurant,
  showMore,
  size = 'md',
}: {
  restaurant: Restaurant
  showMore?: boolean
  size?: 'lg' | 'md'
}) => {
  const tags = restaurant.tags.map((i) => i.taxonomy.name) ?? []
  return (
    <HStack alignItems="center" spacing>
      {tags.slice(0, showMore ? 2 : 10).map((tag) => (
        <TagButton key={tag} rank={1} name={`🍜 ${tag}`} size={size} />
      ))}
      {!!showMore && <Text style={{ opacity: 0.5 }}>+ 5 more</Text>}
    </HStack>
  )
}

export const RestaurantRatingDetail = memo(
  ({
    size = 'md',
    restaurant,
  }: {
    size?: 'lg' | 'md'
    restaurant: Restaurant
  }) => {
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
            <RatingView size={size} restaurant={restaurant} />
          </div>
        }
      >
        <Tooltip height={300} width={250}>
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
            {Object.keys(restaurant.sources).map((source) => {
              const item = restaurant.sources[source]
              return (
                <TableRow key={source}>
                  <TableCell
                    fontWeight="bold"
                    width="50%"
                    // onPress={() => {
                    //   item.url
                    // }}
                  >
                    {source}
                  </TableCell>
                  <TableCell width="25%">{item.rating}</TableCell>
                  <TableCell flex={1}>{Restaurant.WEIGHTS[source]}</TableCell>
                </TableRow>
              )
            })}
          </VStack>
        </Tooltip>
      </Popover>
    )
  }
)
