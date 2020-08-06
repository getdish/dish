import { graphql } from '@dish/graph'
import { Button, HStack, LinearGradient, Text, VStack } from '@dish/ui'
import React, { memo, useState } from 'react'
import { StyleSheet } from 'react-native'

import { useRestaurantQuery } from './useRestaurantQuery'

export const RestaurantMenu = memo(
  graphql(({ restaurantSlug }: { restaurantSlug: string }) => {
    // const [isExpanded, setIsExpanded] = useState(false)
    const restaurant = useRestaurantQuery(restaurantSlug)
    const items = restaurant.menu_items({ limit: 70 })
    return (
      <>
        {!items?.length && (
          <VStack>
            <Text>No menu found.</Text>
          </VStack>
        )}
        {!!items?.length && (
          <VStack position="relative">
            <HStack
              // maxHeight={isExpanded ? 'auto' : 920}
              overflow="hidden"
              spacing={3}
              flexWrap="wrap"
            >
              {items.map((item, i) => (
                <VStack
                  minWidth={200}
                  paddingBottom={10}
                  borderBottomWidth={1}
                  marginBottom={10}
                  borderBottomColor="#f2f2f2"
                  flex={1}
                  overflow="hidden"
                  paddingVertical={4}
                  key={i}
                >
                  <Text fontSize={14}>{item.name}</Text>
                  <Text fontSize={13} opacity={0.5}>
                    {item.description}
                  </Text>
                </VStack>
              ))}
            </HStack>
            {/* {!isExpanded && (
              <LinearGradient
                colors={['rgba(255,255,255,0)', '#fff']}
                style={[
                  {
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '50%',
                    maxHeight: 100,
                  },
                ]}
              />
            )} */}
            {/* <Button
              marginTop={-5}
              zIndex={100}
              position="relative"
              alignSelf="center"
              onPress={() => {
                setIsExpanded((x) => !x)
              }}
            >
              <Text fontWeight="800" fontSize={13}>
                {isExpanded ? 'Close' : 'Show all'}
              </Text>
            </Button> */}
          </VStack>
        )}
      </>
    )
  })
)
