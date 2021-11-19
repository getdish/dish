import { graphql } from '@dish/graph'
import { Grid, Paragraph, Spacer, XStack, YStack, useTheme } from '@dish/ui'
import React, { memo, useState } from 'react'

import { queryRestaurant } from '../../../queries/queryRestaurant'
import { Image } from '../../views/Image'
import { SlantedTitle } from '../../views/SlantedTitle'
import { HiddenSection } from './HiddenSection'

export const RestaurantMenu = memo(
  graphql(({ restaurantSlug }: { restaurantSlug: string }) => {
    const [restaurant] = queryRestaurant(restaurantSlug)
    const [showingMenu, setShowingMenu] = useState(false)
    const items = restaurant?.menu_items({ limit: showingMenu ? 120 : 16 }) ?? []
    const theme = useTheme()
    return (
      <>
        {!items.length && (
          <YStack width="100%" padding={40} alignItems="center" justifyContent="center">
            <Paragraph opacity={0.5}>No menu found.</Paragraph>
          </YStack>
        )}
        {!!items.length && (
          <YStack position="relative">
            <SlantedTitle fontWeight="700" alignSelf="center">
              Menu
            </SlantedTitle>
            <Spacer size="xl" />
            <HiddenSection onChangeOpen={setShowingMenu} cutoff={600}>
              <Grid itemMinWidth={320}>
                {items.map((item, i) => (
                  <YStack
                    paddingVertical={10}
                    paddingHorizontal={20}
                    borderBottomWidth={1}
                    borderBottomColor={theme.borderColor}
                    flex={1}
                    overflow="hidden"
                    key={i}
                  >
                    <XStack>
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
                        <YStack
                          minWidth={50}
                          minHeight={50}
                          maxWidth={50}
                          maxHeight={50}
                          borderRadius={100}
                          backgroundColor={theme.cardBackgroundColor}
                        />
                      )}
                      <Spacer />
                      <YStack flex={1} paddingVertical={2}>
                        <Paragraph sizeLineHeight={0.9} fontWeight="600">
                          {item.name}
                        </Paragraph>
                        <Spacer size="xs" />
                        <Paragraph maxHeight={104} sizeLineHeight={0.8} opacity={0.5}>
                          {item.description}
                        </Paragraph>
                      </YStack>
                      <Spacer />

                      <Paragraph fontWeight="400">{toPrice(item.price ?? 0)}</Paragraph>
                    </XStack>
                  </YStack>
                ))}
              </Grid>
            </HiddenSection>
          </YStack>
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
