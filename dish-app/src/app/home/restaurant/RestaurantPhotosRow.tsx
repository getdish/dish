import { graphql } from '@dish/graph'
import React, { memo } from 'react'
import { Image } from 'react-native'
import { HStack, Text, VStack } from 'snackui'

import { bgLight } from '../../../constants/colors'
import { getImageUrl } from '../../../helpers/getImageUrl'
import { useRestaurantQuery } from '../../hooks/useRestaurantQuery'
import { Link } from '../../views/Link'
import { LinkButton } from '../../views/LinkButton'

export const RestaurantPhotosRow = memo(
  graphql(
    ({
      escalating,
      restaurantSlug,
      onIsAtStart,
      width,
      height,
    }: {
      escalating?: boolean
      restaurantSlug: string
      onIsAtStart?: (x: boolean) => void
      width: number
      height: number
    }) => {
      const restaurant = useRestaurantQuery(restaurantSlug)
      const photos = restaurant.photos() ?? []
      return (
        <HStack>
          {!photos.length && (
            <HStack height={height} minWidth={width} backgroundColor={bgLight}>
              <Text>No photos!</Text>
            </HStack>
          )}
          {!!photos.length && (
            <>
              {photos.slice(0, 9).map((photo, index) => {
                const photoHeight = escalating
                  ? index < 2
                    ? 190
                    : 500
                  : height
                return (
                  <VStack key={index} className={`scroll-snap-photo`}>
                    <Link name="gallery" params={{ restaurantSlug }}>
                      <Image
                        source={{
                          uri: getImageUrl(photo, width, photoHeight, 100),
                        }}
                        style={{
                          height: photoHeight,
                          width,
                        }}
                        resizeMode="cover"
                      />
                    </Link>
                  </VStack>
                )
              })}
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
        </HStack>
      )
    }
  )
)
