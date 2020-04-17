import { Restaurant } from '@dish/models'
import React, { memo } from 'react'

import { LinkButton } from '../ui/Link'
import { StackProps } from '../ui/Stacks'
import { flatButtonStyle, flatButtonStyleSelected } from './baseButtonStyle'
import { RestaurantRatingView } from './RestaurantRatingView'

export const RestaurantButton = memo(
  ({
    restaurant,
    active,
    onHoverIn,
    ...props
  }: {
    active?: boolean
    restaurant: Partial<Restaurant>
  } & StackProps) => {
    return (
      <LinkButton
        key={restaurant.name}
        name="restaurant"
        params={{ slug: restaurant.slug }}
        {...(active ? flatButtonStyleSelected : flatButtonStyle)}
        borderWidth={1}
        borderColor="transparent"
        fontWeight="400"
        fontSize={14}
        {...(active && {
          borderColor: '#eee',
          shadowColor: 'rgba(0,0,0,0.1)',
          shadowRadius: 5,
        })}
        paddingRight={28}
        {...props}
        onHoverIn={() => {
          onHoverIn(restaurant)
        }}
      >
        {restaurant.name}
        <RestaurantRatingView
          size="sm"
          restaurant={restaurant}
          position="absolute"
          top={-26}
          right={-43}
        />
      </LinkButton>
    )
  }
)
