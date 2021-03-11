import { graphql } from '@dish/graph'
import { debounce } from 'lodash'
import React, { Suspense } from 'react'
import { AbsoluteVStack, HStack, Hoverable } from 'snackui'

import { cardFrameHeight, cardFrameWidth } from '../../../constants/constants'
import { getImageUrl } from '../../../helpers/getImageUrl'
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
  backgroundColor?: CardProps['backgroundColor']
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
    backgroundColor,
    padTitleSide,
    hoverable = true,
    dimImage = true,
    below,
  }: RestaurantCardProps) => {
    const [restaurant] = queryRestaurant(restaurantSlug)
    const [price_label, price_color, price_range] = priceRange(restaurant)
    const restaurantPhoto = queryRestaurantCoverPhoto(restaurant)
    // const rating = Math.round(restaurant.rating * 2)
    return (
      <Link name="restaurant" asyncClick params={{ slug: restaurantSlug }}>
        <Card
          isBehind={isBehind}
          size={size}
          title={restaurant.name}
          subTitle={price_range}
          colorsKey={restaurantSlug}
          dimImage={dimImage}
          backgroundColor={backgroundColor}
          outside={(colors) => (
            <>
              {!!below && (
                <HStack
                  zIndex={10000}
                  pointerEvents="none"
                  position="absolute"
                  fullscreen
                >
                  {typeof below === 'function' ? below(colors) : below}
                </HStack>
              )}
              <AbsoluteVStack
                transform={size === 'xs' ? [{ scale: 0.85 }] : []}
                top={-12}
                right={-12}
                zIndex={100}
              >
                <RestaurantRatingView
                  slug={restaurantSlug}
                  floating
                  size={38}
                />
              </AbsoluteVStack>
            </>
          )}
          photo={getImageUrl(restaurantPhoto, cardFrameWidth, cardFrameHeight)}
          aspectFixed={aspectFixed}
          hoverable={hoverable}
          padTitleSide={padTitleSide}
        />
      </Link>
    )
  }
)
