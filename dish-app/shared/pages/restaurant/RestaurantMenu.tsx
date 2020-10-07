import { graphql } from '@dish/graph'
import { HStack, Spacer, Text, VStack } from '@dish/ui'
import React, { memo } from 'react'

import { useRestaurantQuery } from '../../hooks/useRestaurantQuery'
import { SlantedTitle } from '../../views/ui/SlantedTitle'

export const RestaurantMenu = memo(
  graphql(({ restaurantSlug }: { restaurantSlug: string }) => {
    const restaurant = useRestaurantQuery(restaurantSlug)
    const items = restaurant.menu_items({ limit: 120 })
    console.log('items', items)
    return (
      <>
        {!items.length && (
          <VStack
            width="100%"
            padding={40}
            alignItems="center"
            justifyContent="center"
          >
            <Text opacity={0.5}>No menu found.</Text>
          </VStack>
        )}
        {!!items.length && (
          <VStack position="relative">
            <SlantedTitle fontWeight="700" alignSelf="center">
              Menu
            </SlantedTitle>
            <Spacer />
            <VStack overflow="hidden">
              {items.map((item, i) => (
                <VStack
                  paddingVertical={10}
                  paddingHorizontal={20}
                  borderBottomWidth={1}
                  borderBottomColor="#f2f2f2"
                  flex={1}
                  overflow="hidden"
                  key={i}
                >
                  <HStack>
                    <VStack flex={1}>
                      <Text fontSize={18} fontWeight="600">
                        {item.name}
                      </Text>
                      <Spacer size="xs" />
                      <Text fontSize={16} opacity={0.5}>
                        {item.description}
                      </Text>
                    </VStack>
                    <Text>{item.price}</Text>
                  </HStack>
                </VStack>
              ))}
            </VStack>
          </VStack>
        )}
      </>
    )
  })
)
