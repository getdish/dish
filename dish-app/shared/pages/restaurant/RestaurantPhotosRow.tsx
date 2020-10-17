import { graphql } from '@dish/graph'
import React, { memo, useRef } from 'react'
import { Image, ScrollView } from 'react-native'
import { HStack, Text, VStack } from 'snackui'

import { bgLight } from '../../colors'
import { getImageUrl } from '../../helpers/getImageUrl'
import { useRestaurantQuery } from '../../hooks/useRestaurantQuery'
import { LinkButton } from '../../views/ui/LinkButton'

export const RestaurantPhotosRow = memo(
  graphql(
    ({
      restaurantSlug,
      onIsAtStart,
      width,
      height,
    }: {
      restaurantSlug: string
      onIsAtStart?: (x: boolean) => void
      width: number
      height: number
    }) => {
      const isAtStart = useRef(true)
      const restaurant = useRestaurantQuery(restaurantSlug)
      const photos = restaurant.photos() ?? []
      return (
        <VStack className="scroll-snap-photos">
          <ScrollView
            style={{ width: '100%' }}
            horizontal
            showsVerticalScrollIndicator={false}
            {...(onIsAtStart && {
              scrollEventThrottle: 100,
              onScroll: (e) => {
                const next = e.nativeEvent.contentOffset.x === 0
                if (next !== isAtStart.current) {
                  isAtStart.current = next
                  onIsAtStart?.(next)
                }
              },
            })}
          >
            {!photos.length && (
              <HStack
                height={height}
                minWidth={width}
                backgroundColor={bgLight}
              >
                <Text>No photos!</Text>
              </HStack>
            )}
            {!!photos.length && (
              <>
                {photos.slice(0, 9).map((photo, key) => (
                  <VStack key={key} className="scroll-snap-photo">
                    <LinkButton name="gallery" params={{ restaurantSlug }}>
                      <Image
                        source={{ uri: getImageUrl(photo, width, height, 100) }}
                        style={{
                          height,
                          width,
                        }}
                        resizeMode="cover"
                      />
                    </LinkButton>
                  </VStack>
                ))}
                <VStack className="scroll-snap-photo">
                  <LinkButton
                    width={width}
                    height={height}
                    alignItems="center"
                    justifyContent="center"
                    color={'rgba(0,0,0,0.5)'}
                    name="gallery"
                    params={{ restaurantSlug }}
                  >
                    View all
                  </LinkButton>
                </VStack>
              </>
            )}
          </ScrollView>
        </VStack>
      )
    }
  )
)
