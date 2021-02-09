import { graphql } from '@dish/graph'
import React, { Suspense } from 'react'
import { AbsoluteVStack, Hoverable, useDebounce } from 'snackui'

import { green } from '../../../constants/colors'
import {
  queryRestaurant,
  queryRestaurantCoverPhoto,
} from '../../../queries/queryRestaurant'
import { appMapStore } from '../../AppMapStore'
import { CardFrame } from '../../views/CardFrame'
import { Link } from '../../views/Link'
import { RestaurantUpVoteDownVote } from '../../views/restaurant/RestaurantUpVoteDownVote'
import { Card, CardProps } from './Card'
import { priceRange } from './RestaurantDetailRow'
import { RestaurantRating } from './RestaurantRating'

export type RestaurantCardProps = {
  restaurantSlug: string
  restaurantId: string
  below?: CardProps['below']
  aspectFixed?: CardProps['aspectFixed']
  size?: CardProps['size']
  isBehind?: boolean
  hideScore?: boolean
  hoverable?: boolean
  hoverToMap?: boolean
  padTitleSide?: boolean
  dimImage?: boolean
}

export const RestaurantCard = (props: RestaurantCardProps) => {
  const fallbackCard = <CardFrame aspectFixed size={props.size} />
  const handleHover = useDebounce(
    () =>
      appMapStore.setHovered({
        id: props.restaurantId,
        slug: props.restaurantSlug,
        via: 'list',
      }),
    200
  )

  if (!props.restaurantSlug) {
    return fallbackCard
  }

  const content = (
    <Suspense fallback={fallbackCard}>
      <RestaurantCardContent {...props} />
    </Suspense>
  )

  if (props.hoverToMap) {
    return <Hoverable onHoverIn={handleHover}>{content}</Hoverable>
  }

  return content
}

export const RestaurantCardContent = graphql(
  ({
    size = 'md',
    restaurantSlug,
    restaurantId,
    isBehind,
    hideScore,
    aspectFixed,
    padTitleSide,
    hoverable = true,
    dimImage,
    below,
  }: RestaurantCardProps) => {
    const [restaurant] = queryRestaurant(restaurantSlug)
    const [price_label, price_color, price_range] = priceRange(restaurant)
    const restaurantPhoto = queryRestaurantCoverPhoto(restaurant)
    const rating = Math.round(restaurant.rating * 2)
    return (
      <Link name="restaurant" asyncClick params={{ slug: restaurantSlug }}>
        <Card
          isBehind={isBehind}
          size={size}
          title={restaurant.name}
          subTitle={price_range}
          below={below}
          dimImage={dimImage}
          outside={
            (colors) => {
              return (
                <AbsoluteVStack
                  position="absolute"
                  top={-7}
                  right={-10}
                  zIndex={100}
                >
                  <RestaurantRating
                    darken
                    size="sm"
                    colors={colors}
                    rating={rating}
                  />
                </AbsoluteVStack>
              )
            }
            // <Text
            //   position="absolute"
            //   zIndex={1000}
            //   top={-15}
            //   right={-15}
            //   textShadowColor="rgba(0,0,0,0.5)"
            //   textShadowRadius={3}
            //   fontSize={42}
            // >
            //   💎
            // </Text>
            // !hideScore && (
            //   <AbsoluteVStack bottom={-10} right={-10} zIndex={20}>
            //     <RestaurantUpVoteDownVote
            //       rounded
            //       display="ratio"
            //       restaurantSlug={restaurantSlug}
            //     />
            //   </AbsoluteVStack>
            // )
          }
          photo={restaurantPhoto}
          aspectFixed={aspectFixed}
          hoverable={hoverable}
          padTitleSide={padTitleSide}
        />
      </Link>
    )
  }
)
