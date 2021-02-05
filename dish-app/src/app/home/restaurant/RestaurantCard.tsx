import { graphql } from '@dish/graph'
import React, { Suspense } from 'react'
import { AbsoluteVStack } from 'snackui'

import {
  queryRestaurant,
  queryRestaurantCoverPhoto,
} from '../../../queries/queryRestaurant'
import { CardFrame } from '../../views/CardFrame'
import { Link } from '../../views/Link'
import { RestaurantUpVoteDownVote } from '../../views/restaurant/RestaurantUpVoteDownVote'
import { Card, CardProps } from './Card'
import { priceRange } from './RestaurantDetailRow'

export type RestaurantCardProps = {
  restaurantSlug: string
  restaurantId: string
  below?: CardProps['below']
  aspectFixed?: CardProps['below']
  size?: CardProps['size']
  isBehind?: boolean
  hideScore?: boolean
  hoverable?: boolean
  padTitleSide?: boolean
  dimImage?: boolean
}

const fallbackCard = <CardFrame aspectFixed />

export const RestaurantCard = (props: RestaurantCardProps) => {
  if (!props.restaurantSlug) {
    return fallbackCard
  }
  return (
    <Suspense fallback={fallbackCard}>
      <RestaurantCardContent {...props} />
    </Suspense>
  )
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
            !hideScore && (
              <AbsoluteVStack bottom={-10} right={-10} zIndex={20}>
                <RestaurantUpVoteDownVote
                  rounded
                  display="ratio"
                  restaurantSlug={restaurantSlug}
                />
              </AbsoluteVStack>
            )
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
