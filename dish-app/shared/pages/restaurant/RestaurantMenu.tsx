import { graphql } from '@dish/graph'
import { Button, HStack, LinearGradient, Spacer, Text, VStack } from '@dish/ui'
import React, { memo, useState } from 'react'

import { useRestaurantQuery } from '../../hooks/useRestaurantQuery'

export const RestaurantMenu = memo(
  graphql(({ restaurantSlug }: { restaurantSlug: string }) => {
    const restaurant = useRestaurantQuery(restaurantSlug)
    const items = restaurant.menu_items({ limit: 100 })
    return (
      <>
        {!items?.length && (
          <VStack>
            <Text>No menu found.</Text>
          </VStack>
        )}
        {!!items?.length && (
          <VStack position="relative">
            <VStack overflow="hidden">
              {items.map((item, i) => (
                <VStack
                  paddingVertical={10}
                  borderBottomWidth={1}
                  borderBottomColor="#f2f2f2"
                  flex={1}
                  overflow="hidden"
                  key={i}
                >
                  <Text fontSize={16} fontWeight="600">
                    {item.name}
                  </Text>
                  <Spacer size="xs" />
                  <Text fontSize={16} opacity={0.5}>
                    {item.description}
                  </Text>
                </VStack>
              ))}
            </VStack>
          </VStack>
        )}
      </>
    )
  })
)
