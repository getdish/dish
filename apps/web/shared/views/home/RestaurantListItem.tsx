import { Restaurant } from '@dish/models'
import React, {
  memo,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import {
  Button,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native'

import { useOvermind } from '../../state/om'
import { Divider } from '../shared/Divider'
import Hoverable from '../shared/Hoverable'
import { Link, LinkButton } from '../shared/Link'
import { Spacer } from '../shared/Spacer'
import { HStack, VStack, ZStack } from '../shared/Stacks'
import { lightLightBg } from './colors'
import { RankingView } from './RankingView'
import { RestaurantAddComment } from './RestaurantAddComment'
import { RestaurantDetailRow } from './RestaurantDetailRow'
import { RestaurantFavoriteStar } from './RestaurantFavoriteStar'
import { RestaurantMetaRow } from './RestaurantMetaRow'
import { RestaurantRatingDetail } from './RestaurantRatingDetail'
import { RestaurantTagsRow } from './RestaurantTagsRow'
import { RestaurantUpVoteDownVote } from './RestaurantUpVoteDownVote'

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
  const [disablePress, setDisablePress] = useState(false)
  const hoverTm = useRef<any>(0)
  const userReview = om.state.user.allReviews[restaurant.id]

  useEffect(() => {
    return om.reaction(
      (state) => state.home.activeIndex,
      (activeIndex) => {
        setIsHovered(rank == activeIndex + 1)
      }
    )
  }, [])

  return (
    <Hoverable
      onHoverIn={() => {
        setIsHovered(true)
        hoverTm.current = setTimeout(() => onHover(restaurant), 100)
      }}
      onHoverOut={() => {
        clearTimeout(hoverTm.current)
        setIsHovered(false)
      }}
    >
      <TouchableOpacity
        disabled={disablePress}
        activeOpacity={0.8}
        onPress={() => {
          om.actions.router.navigate({
            name: 'restaurant',
            params: { slug: restaurant.slug },
          })
        }}
      >
        <HStack
          alignItems="center"
          backgroundColor={isHovered ? lightLightBg : 'transparent'}
          position="relative"
        >
          <ZStack
            fullscreen
            zIndex={100}
            top={40}
            justifyContent="center"
            pointerEvents="none"
            opacity={isHovered ? 1 : 0}
          >
            <RestaurantUpVoteDownVote restaurant={restaurant} />
          </ZStack>

          <VStack
            padding={18}
            paddingLeft={24}
            paddingVertical={28}
            width="76%"
            maxWidth={525}
          >
            <Link name="restaurant" params={{ slug: restaurant.slug }}>
              <HStack alignItems="center" marginVertical={-3}>
                <RankingView rank={rank} />
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: 'bold',
                    textDecorationColor: 'transparent',
                  }}
                >
                  {restaurant.name}
                </Text>
              </HStack>
            </Link>

            <Spacer />

            <HStack alignItems="center" marginTop={-8}>
              <HStack alignItems="center" paddingLeft={18}>
                <RestaurantFavoriteStar
                  isHovered={isHovered}
                  restaurant={restaurant}
                />
                <Spacer />
                <RestaurantTagsRow showMore restaurant={restaurant} />
              </HStack>
            </HStack>

            <Spacer size="sm" />

            <HStack alignItems="center" paddingLeft={22}>
              <RestaurantMetaRow showMenu showAddress restaurant={restaurant} />
            </HStack>
            <Spacer size="sm" />
            <RestaurantDetailRow size="sm" restaurant={restaurant} />

            {!!om.state.user.isLoggedIn && (
              <RestaurantAddComment restaurant={restaurant} />
            )}
          </VStack>

          <Spacer size="lg" />

          <RestaurantPeek restaurant={restaurant} />
        </HStack>
        <Divider />
      </TouchableOpacity>
    </Hoverable>
  )
}

export const RestaurantPeek = memo(
  ({ restaurant }: { restaurant: Restaurant }) => {
    const spacing = 5
    const photos = Restaurant.allPhotos(restaurant).slice(0, 5)
    return (
      <VStack
        position="relative"
        marginRight={-spacing}
        marginBottom={-spacing}
      >
        <VStack position="absolute" top={-11} left={-38} zIndex={100}>
          <RestaurantRatingDetail restaurant={restaurant} />
        </VStack>
        <HStack flexWrap="wrap" maxWidth={120} spacing={spacing}>
          {[...photos, photos[0], photos[0], photos[0]]
            .slice(0, 4)
            .map((photo, i) => {
              return (
                <VStack
                  key={i}
                  borderRadius={10}
                  shadowColor="rgba(0,0,0,0.2)"
                  shadowRadius={4}
                  shadowOffset={{ height: 2, width: 0 }}
                  marginBottom={spacing}
                  overflow="hidden"
                >
                  <Image
                    source={{ uri: photo }}
                    style={{
                      width: 50,
                      height: 50,
                    }}
                    resizeMode="cover"
                  />
                </VStack>
              )
            })}
        </HStack>
      </VStack>
    )
  }
)
