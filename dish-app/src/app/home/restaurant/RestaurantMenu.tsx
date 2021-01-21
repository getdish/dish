import { graphql } from '@dish/graph'
import React, { memo } from 'react'
import { Image } from 'react-native'
import { Grid, HStack, Paragraph, Spacer, Text, VStack } from 'snackui'

import { queryRestaurant } from '../../../queries/queryRestaurant'
import { SlantedTitle } from '../../views/SlantedTitle'

export const RestaurantMenu = memo(
  graphql(({ restaurantSlug }: { restaurantSlug: string }) => {
    const [restaurant] = queryRestaurant(restaurantSlug)
    const items = restaurant.menu_items({ limit: 120 })
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
            <Spacer size="xl" />
            <Grid itemMinWidth={320}>
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
                    {!!item.image && (
                      <>
                        <Image
                          source={{
                            uri: item.image,
                          }}
                          style={{
                            width: 50,
                            height: 50,
                            borderRadius: 100,
                          }}
                        />
                      </>
                    )}
                    {!item.image && (
                      <VStack
                        minWidth={50}
                        minHeight={50}
                        maxWidth={50}
                        maxHeight={50}
                        borderRadius={100}
                        backgroundColor="#eee"
                      />
                    )}
                    <Spacer />
                    <VStack flex={1} paddingVertical={2}>
                      <Paragraph sizeLineHeight={0.9} fontWeight="600">
                        {item.name}
                      </Paragraph>
                      <Spacer size="xs" />
                      <Paragraph sizeLineHeight={0.8} opacity={0.5}>
                        {item.description}
                      </Paragraph>
                    </VStack>
                    <Spacer />

                    <Paragraph fontWeight="400">
                      {toPrice(item.price ?? 0)}
                    </Paragraph>
                  </HStack>
                </VStack>
              ))}
            </Grid>
          </VStack>
        )}
      </>
    )
  })
)

const toPrice = (priceNum: number) => {
  if (priceNum % 100 === 0) {
    return `$${priceNum / 100}`
  }
  return `$${Math.floor(priceNum / 100)}.${priceNum % 100}`
}
