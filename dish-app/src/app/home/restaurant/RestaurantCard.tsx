import { graphql } from '@dish/graph'
import { debounce } from 'lodash'
import React, { Suspense } from 'react'
import { AbsoluteVStack, Hoverable } from 'snackui'

import {
  queryRestaurant,
  queryRestaurantCoverPhoto,
} from '../../../queries/queryRestaurant'
import { appMapStore } from '../../AppMapStore'
import { CardFrame } from '../../views/CardFrame'
import { Link } from '../../views/Link'
import { RestaurantRatingView } from '../RestaurantRatingView'
import { Card, CardProps } from './Card'
import { priceRange } from './RestaurantDetailRow'

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

const setHovered = debounce(appMapStore.setHovered, 300)

export const RestaurantCard = (props: RestaurantCardProps) => {
  const fallbackCard = <CardFrame aspectFixed size={props.size} />

  if (!props.restaurantSlug) {
    return fallbackCard
  }

  const content = (
    <Suspense fallback={fallbackCard}>
      <RestaurantCardContent {...props} />
    </Suspense>
  )

  if (props.hoverToMap) {
    return (
      <Hoverable
        onHoverIn={() => {
          setHovered({
            id: props.restaurantId,
            slug: props.restaurantSlug,
            via: 'list',
          })
        }}
      >
        {content}
      </Hoverable>
    )
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
          colorsKey={restaurantSlug}
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
                  <RestaurantRatingView
                    slug={restaurantSlug}
                    floating
                    size={40}
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
