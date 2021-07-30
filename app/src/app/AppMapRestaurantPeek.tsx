import { graphql } from '@dish/graph'
import { useStoreInstanceSelector } from '@dish/use-store'
import React, { memo, useEffect, useState } from 'react'
import { Box, HStack, Spacer, Text, VStack } from 'snackui'

import { queryRestaurant } from '../queries/queryRestaurant'
import { appMapStore } from './AppMapStore'
import { useHomeStore } from './homeStore'
import { Image } from './views/Image'
import { LinkButton } from './views/LinkButton'

export const AppMapRestaurantPeek = memo(
  graphql(() => {
    const home = useHomeStore()
    const [slug, setSlug] = useState('')
    const [selectedSlug, hoveredSlug] = useStoreInstanceSelector(
      appMapStore,
      (x) => [x.selected?.slug ?? '', x.hovered?.slug ?? ''] as const
    )

    // TODO could make hook useMostRecentValue(...args)

    useEffect(() => {
      setSlug(selectedSlug)
    }, [selectedSlug])

    useEffect(() => {
      setSlug(hoveredSlug)
    }, [hoveredSlug])

    const state = home.currentState

    if (state.type === 'restaurant' && slug === state.restaurantSlug) {
      return null
    }

    const containerWrap = (children: any) => {
      return (
        <Box
          overflow="visible"
          minWidth={200}
          pointerEvents="auto"
          // flex-wrap spacing
          marginTop={15}
          maxWidth="98%"
          paddingHorizontal={0}
          paddingVertical={0}
          className={`animate-up ${slug ? 'active' : 'untouchable'}`}
          shadowColor="rgba(0,0,0,0.25)"
          shadowRadius={10}
        >
          {children}
        </Box>
      )
    }

    if (!slug) {
      return containerWrap(null)
    }

    const [restaurant] = queryRestaurant(slug)

    if (!restaurant) {
      return null
    }

    return containerWrap(
      <>
        <HStack
          flex={1}
          paddingHorizontal={8}
          paddingVertical={8}
          overflow="hidden"
          alignItems="center"
          borderRadius={20}
        >
          <VStack flex={5} overflow="hidden">
            <LinkButton pointerEvents="auto" key={slug} name="restaurant" params={{ slug }}>
              <Text ellipse selectable fontSize={16} fontWeight="600" paddingRight={30}>
                {restaurant.name}
              </Text>
            </LinkButton>
          </VStack>

          {!!restaurant.image && (
            <>
              <Spacer size="sm" />
              <Image
                resizeMode="cover"
                source={{ uri: restaurant.image }}
                style={{
                  marginVertical: -50,
                  marginRight: -40,
                  height: 80,
                  width: 80,
                  borderRadius: 100,
                }}
              />
            </>
          )}
        </HStack>
      </>
    )
  })
)
