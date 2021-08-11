import { graphql } from '@dish/graph'
import React, { memo, useState } from 'react'
import { StyleSheet } from 'react-native'
import {
  AbsoluteHStack,
  Button,
  Grid,
  HStack,
  LinearGradient,
  Paragraph,
  Spacer,
  VStack,
  useTheme,
} from 'snackui'

import { queryRestaurant } from '../../../queries/queryRestaurant'
import { Image } from '../../views/Image'
import { SlantedTitle } from '../../views/SlantedTitle'

export const HiddenSection = (props: { children: any; cutoff: number }) => {
  const theme = useTheme()
  const [open, setOpen] = useState(false)

  return (
    <VStack overflow="hidden" position="relative" maxHeight={open ? 10_000 : props.cutoff}>
      {props.children}
      <AbsoluteHStack zIndex={10} bottom={0} left={0} right={0} justifyContent="center">
        <Button onClick={() => setOpen((x) => !x)}>{open ? 'Close' : 'Show full menu'}</Button>
      </AbsoluteHStack>
      <LinearGradient
        pointerEvents="none"
        style={[StyleSheet.absoluteFill, { top: '50%', opacity: open ? 0 : 1 }]}
        start={[0, 0]}
        end={[0, 1]}
        colors={[theme.backgroundColorTransparent, theme.backgroundColor]}
      />
    </VStack>
  )
}

export const RestaurantMenu = memo(
  graphql(({ restaurantSlug }: { restaurantSlug: string }) => {
    const [restaurant] = queryRestaurant(restaurantSlug)
    const items = restaurant?.menu_items({ limit: 120 }) ?? []
    const theme = useTheme()
    return (
      <>
        {!items.length && (
          <VStack width="100%" padding={40} alignItems="center" justifyContent="center">
            <Paragraph opacity={0.5}>No menu found.</Paragraph>
          </VStack>
        )}
        {!!items.length && (
          <VStack position="relative">
            <SlantedTitle fontWeight="700" alignSelf="center">
              Menu
            </SlantedTitle>
            <Spacer size="xl" />
            <HiddenSection cutoff={600}>
              <Grid itemMinWidth={320}>
                {items.map((item, i) => (
                  <VStack
                    paddingVertical={10}
                    paddingHorizontal={20}
                    borderBottomWidth={1}
                    borderBottomColor={theme.borderColor}
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
                          backgroundColor={theme.cardBackgroundColor}
                        />
                      )}
                      <Spacer />
                      <VStack flex={1} paddingVertical={2}>
                        <Paragraph sizeLineHeight={0.9} fontWeight="600">
                          {item.name}
                        </Paragraph>
                        <Spacer size="xs" />
                        <Paragraph maxHeight={104} sizeLineHeight={0.8} opacity={0.5}>
                          {item.description}
                        </Paragraph>
                      </VStack>
                      <Spacer />

                      <Paragraph fontWeight="400">{toPrice(item.price ?? 0)}</Paragraph>
                    </HStack>
                  </VStack>
                ))}
              </Grid>
            </HiddenSection>
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
