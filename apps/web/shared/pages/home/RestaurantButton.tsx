import { graphql } from '@dish/graph'
import { HStack, Text } from '@dish/ui'
import { default as React, memo } from 'react'

import { LinkButton } from '../../views/ui/LinkButton'
import { LinkButtonProps } from '../../views/ui/LinkProps'
import RestaurantRatingView from './RestaurantRatingView'
import { TrendingIcon } from './TrendingIcon'
import { useRestaurantQuery } from './useRestaurantQuery'

export const RestaurantButton = memo(
  graphql(
    ({
      restaurantSlug,
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
      restaurantSlug: string
      trending?: 'up' | 'down' | 'neutral'
      subtle?: boolean
    } & LinkButtonProps) => {
      const restaurant = useRestaurantQuery(restaurantSlug)
      return (
        <LinkButton
          key={restaurant.name}
          pointerEvents="auto"
          {...(subtle && {
            backgroundColor: 'transparent',
          })}
          zIndex={1}
          padding={5}
          borderRadius={6}
          hoverStyle={{
            borderColor: '#eee',
            shadowColor: 'rgba(0,0,0,0.1)',
            shadowRadius: 5,
            zIndex: 2,
          }}
          paddingRight={32}
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
                marginTop={-8}
                marginRight={5}
                marginBottom={-7}
                top={1}
              />
            )}
            <Text
              ellipse
              fontSize={14}
              fontWeight={active ? '600' : '400'}
              color={active ? '#000' : '#444'}
              marginRight={5}
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
              top={-5}
              right={-30}
              subtle={subtle}
            />
          </HStack>
        </LinkButton>
      )
    }
  )
)
