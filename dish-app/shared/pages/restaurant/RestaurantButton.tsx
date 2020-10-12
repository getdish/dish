import { graphql } from '@dish/graph'
import { HStack, Spacer, Text, VStack } from '@dish/ui'
import { default as React, memo } from 'react'

import { isWeb } from '../../constants'
import { useRestaurantQuery } from '../../hooks/useRestaurantQuery'
import { LinkButton } from '../../views/ui/LinkButton'
import { LinkButtonProps } from '../../views/ui/LinkProps'
import { TrendingIcon } from '../../views/ui/TrendingIcon'
import RestaurantRatingView from './RestaurantRatingView'

export const RestaurantButton = memo(
  graphql(
    ({
      restaurantSlug,
      active,
      zIndex,
      rank,
      trending,
      subtle,
      color,
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
      if (!restaurant) {
        // got an error when resizing between small/regular
        return null
      }
      return (
        <LinkButton
          key={restaurant.name}
          pointerEvents="auto"
          {...(subtle && {
            backgroundColor: 'transparent',
          })}
          zIndex={1}
          paddingHorizontal={7}
          paddingVertical={8}
          borderRadius={6}
          minWidth={150}
          hoverStyle={{
            borderColor: '#eee',
            shadowColor: 'rgba(0,0,0,0.1)',
            shadowRadius: 5,
            zIndex: 2,
          }}
          {...props}
          name="restaurant"
          params={{ slug: restaurant.slug }}
          onHoverIn={() => {
            onHoverIn?.(restaurant)
          }}
        >
          <HStack
            maxWidth={isWeb ? 200 : 180}
            flex={1}
            alignItems="center"
            justifyContent="flex-end"
            position="relative"
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
              fontSize={16}
              fontWeight={active ? '600' : '400'}
              color={color ?? (active ? '#000' : '#444')}
              // marginRight={25}
            >
              {typeof rank === 'number' ? `${rank}. ` : ''}
              {restaurant.name}
            </Text>
            <Spacer size="sm" />
            <VStack marginVertical={subtle ? -8 : -10}>
              <RestaurantRatingView
                size="xs"
                restaurantSlug={restaurant.slug ?? ''}
                rating={restaurant.rating}
                subtle={subtle}
              />
            </VStack>
          </HStack>
        </LinkButton>
      )
    }
  )
)
