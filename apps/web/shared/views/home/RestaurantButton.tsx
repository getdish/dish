import { Restaurant } from '@dish/graph'
import { HStack } from '@dish/ui'
import React, { memo } from 'react'
import { ChevronDown, ChevronUp } from 'react-feather'
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
    trending,
    subtle,
    onHoverIn,
    ...props
  }: {
    active?: boolean
    rank?: number
    restaurant: Partial<Restaurant>
    trending?: 'up' | 'down'
    subtle?: boolean
  } & LinkButtonProps) => {
    const TrendingIcon = trending === 'up' ? ChevronUp : ChevronDown
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
          onHoverIn?.(restaurant)
        }}
      >
<<<<<<< HEAD
        <HStack alignItems="center" spacing={5}>
          {!!trending && (
            <TrendingIcon
              size={12}
              color={trending === 'up' ? 'green' : 'red'}
            />
          )}
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
            top={0}
            right={-35}
            subtle={subtle}
          />
        </HStack>
=======
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
          restaurantSlug={restaurant.slug ?? ''}
          rating={restaurant.rating}
          // @ts-ignore
          position="absolute"
          top={4}
          right={4}
          subtle={subtle}
        />
>>>>>>> [web] fix last strict types and new graph types compilation issues
      </LinkButton>
    )
  }
)
