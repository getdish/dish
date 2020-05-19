import { Restaurant } from '@dish/graph'
import React, { memo } from 'react'
import { Text } from 'react-native'

import { LinkButton, LinkButtonProps } from '../ui/LinkButton'
import { flatButtonStyle, flatButtonStyleSelected } from './baseButtonStyle'
import RestaurantRatingView from './RestaurantRatingView'

export const RestaurantButton = memo(
  ({
    restaurant,
    active,
    zIndex,
    rank,
    subtle,
    onHoverIn,
    ...props
  }: {
    active?: boolean
    rank?: number
    restaurant: Partial<Restaurant>
    subtle?: boolean
  } & LinkButtonProps) => {
    return (
      <LinkButton
        key={restaurant.name}
        name="restaurant"
        pointerEvents="auto"
        params={{ slug: restaurant.slug }}
        {...(active ? flatButtonStyleSelected : flatButtonStyle)}
        {...(subtle && {
          backgroundColor: 'transparent',
        })}
        fontWeight="400"
        fontSize={14}
        zIndex={active ? 2 : 1}
        {...(active && {
          borderColor: '#eee',
          shadowColor: 'rgba(0,0,0,0.1)',
          shadowRadius: 5,
        })}
        paddingRight={34}
        {...props}
        onHoverIn={() => {
          onHoverIn(restaurant)
        }}
      >
        <Text
          style={
            {
              overflow: 'hidden',
              textWrap: 'no-wrap',
              whiteSpace: 'pre',
              textOverflow: 'ellipsis',
            } as any
          }
        >
          {typeof rank === 'number' ? `${rank}. ` : ''}
          {restaurant.name}
        </Text>
        <RestaurantRatingView
          size="xs"
          restaurantSlug={restaurant.slug}
          rating={restaurant.rating}
          // @ts-ignore
          position="absolute"
          top={4}
          right={4}
          subtle={subtle}
        />
      </LinkButton>
    )
  }
)
