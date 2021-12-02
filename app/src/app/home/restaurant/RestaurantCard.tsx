import { Restaurant, graphql, restaurant } from '@dish/graph'
import { AbsoluteYStack, Hoverable, XStack } from '@dish/ui'
import { debounce } from 'lodash'
import React, { Suspense } from 'react'

import { cardFrameHeight, cardFrameWidth } from '../../../constants/constants'
import { getImageUrl } from '../../../helpers/getImageUrl'
import { queryRestaurant, queryRestaurantCoverPhoto } from '../../../queries/queryRestaurant'
import { appMapStore } from '../../appMapStore'
import { CardFrame } from '../../views/CardFrame'
import { Link } from '../../views/Link'
import { RestaurantRatingView } from '../RestaurantRatingView'
import { Card, CardProps } from './Card'
import { priceRange } from './RestaurantDetailRow'

export type RestaurantCardProps = {
  restaurant: restaurant
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
            id: props.restaurant.id,
            slug: props.restaurant.slug || '',
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
    size = '$4',
    restaurant,
    isBehind,
    hideScore,
    aspectFixed,
    backgroundColor,
    padTitleSide,
    hoverable = true,
    dimImage = true,
    below,
  }: RestaurantCardProps) => {
    if (!restaurant) {
      return null
    }
    const [price_label, price_color, price_range] = priceRange(restaurant)
    const restaurantPhoto = queryRestaurantCoverPhoto(restaurant)
    const photo = restaurantPhoto
      ? getImageUrl(restaurantPhoto, cardFrameWidth, cardFrameHeight)
      : null

    if (restaurant.name === 'Safeway') {
      return null
    }

    // const rating = Math.round(restaurant.rating * 2)
    const content = (
      <Link name="restaurant" asyncClick params={{ slug: restaurant.slug || '' }}>
        <Card
          isBehind={isBehind}
          size={size}
          title={restaurant.name}
          subTitle={price_range}
          colorsKey={restaurant.slug || ''}
          dimImage={dimImage}
          backgroundColor={backgroundColor}
          outside={() => (
            <>
              {!!below && (
                <XStack zIndex={10000} pointerEvents="none" position="absolute" fullscreen>
                  {typeof below === 'function' ? below() : below}
                </XStack>
              )}
              <AbsoluteYStack top={-6} right={-6} zIndex={100}>
                <RestaurantRatingView restaurant={restaurant} floating size={32} />
              </AbsoluteYStack>
            </>
          )}
          photo={photo}
          aspectFixed={aspectFixed}
          hoverEffect={hoverable ? 'scale' : null}
          padTitleSide={padTitleSide}
        />
      </Link>
    )

    if (!photo) {
      return null
    }

    return content
  }
)
