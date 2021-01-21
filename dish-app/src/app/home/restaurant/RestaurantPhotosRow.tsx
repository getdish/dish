import { graphql, order_by } from '@dish/graph'
import React, { memo } from 'react'
import { Image } from 'react-native'
import { HStack, Text, VStack } from 'snackui'

import { bgLight } from '../../../constants/colors'
import { getImageUrl } from '../../../helpers/getImageUrl'
import { queryRestaurant } from '../../../queries/queryRestaurant'
import { Link } from '../../views/Link'
import { LinkButton } from '../../views/LinkButton'

export const RestaurantPhotosRow = memo(
  graphql(
    ({
      escalating,
      showEscalated,
      restaurantSlug,
      onIsAtStart,
      width,
      height,
    }: {
      escalating?: boolean
      showEscalated?: boolean
      restaurantSlug: string
      onIsAtStart?: (x: boolean) => void
      width: number
      height: number
    }) => {
      const [restaurant] = queryRestaurant(restaurantSlug)
      const photos = restaurant.photo_table({
        limit: 6,
        order_by: [
          {
            photo: {
              quality: order_by.desc,
            },
          },
        ],
      })
      return (
        <HStack>
          {!photos.length && (
            <HStack height={height} minWidth={width} backgroundColor={bgLight}>
              <Text>No photos!</Text>
            </HStack>
          )}
          {!!photos.length && (
            <>
              {photos.map((photo, index) => {
                const photoHeight = escalating
                  ? index < 2
                    ? 190
                    : 500
                  : height
                const isEscalated = escalating && index >= 2
                const photoWidth = isEscalated ? width * 2 : width
                return (
                  <VStack
                    width={photoWidth}
                    height={photoHeight}
                    key={index}
                    className={`scroll-snap-photo`}
                  >
                    {(!isEscalated || showEscalated || index === 2) && (
                      <Link name="gallery" params={{ restaurantSlug }}>
                        <Image
                          source={{
                            uri: getImageUrl(
                              photo.photo.url,
                              photoWidth,
                              photoHeight,
                              100
                            ),
                          }}
                          style={{
                            height: photoHeight,
                            width: photoWidth,
                          }}
                          resizeMode="cover"
                        />
                      </Link>
                    )}
                  </VStack>
                )
              })}
              <VStack>
                <LinkButton
                  width={width * 2}
                  height="100%"
                  name="gallery"
                  alignItems="center"
                  justifyContent="center"
                  params={{ restaurantSlug }}
                  textProps={{
                    textAlign: 'center',
                    fontSize: 28,
                    fontWeight: '800',
                  }}
                >
                  Gallery 🖼
                </LinkButton>
              </VStack>
            </>
          )}
        </HStack>
      )
    }
  )
)
