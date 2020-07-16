import { Restaurant } from '@dish/graph'
import { HStack, Text } from '@dish/ui'
import { default as React, memo } from 'react'

import { LinkButton } from '../../views/ui/LinkButton'
import { LinkButtonProps } from '../../views/ui/LinkProps'
import { flatButtonStyle, flatButtonStyleSelected } from './baseButtonStyle'
import RestaurantRatingView from './RestaurantRatingView'
import { TrendingIcon } from './TrendingIcon'

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
    trending?: 'up' | 'down' | 'neutral'
    subtle?: boolean
  } & LinkButtonProps) => {
    return (
      <LinkButton
        key={restaurant.name}
        pointerEvents="auto"
        {...(active ? flatButtonStyleSelected : flatButtonStyle)}
        {...(subtle && {
          backgroundColor: 'transparent',
        })}
        zIndex={1}
        {...(active && {
          borderColor: '#eee',
          shadowColor: 'rgba(0,0,0,0.1)',
          shadowRadius: 5,
          zIndex: 2,
        })}
        paddingRight={40}
        {...props}
        name="restaurant"
        params={{ slug: restaurant.slug }}
        onHoverIn={() => {
          onHoverIn?.(restaurant)
        }}
      >
        <HStack
          maxWidth="100%"
          flex={1}
          alignItems="center"
          position="relative"
          justifyContent="center"
        >
          {!!trending && (
            <TrendingIcon
              size={16}
              trending={trending}
              marginTop={-4}
              marginRight={5}
              marginBottom={-5}
            />
          )}
          <Text
            ellipse
            fontSize={14}
            fontWeight={active ? '500' : '300'}
            color={active ? '#000' : '#666'}
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
            top={0}
            right={-30}
            subtle={subtle}
          />
        </HStack>
      </LinkButton>
    )
  }
)
