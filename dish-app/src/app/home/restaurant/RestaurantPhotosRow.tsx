import { graphql, order_by } from '@dish/graph'
import { isPresent } from '@dish/helpers/src'
import React, { Suspense, memo } from 'react'
import { Image } from 'react-native'
import { HStack, Text, VStack } from 'snackui'

import { bgLight } from '../../../constants/colors'
import { getImageUrl } from '../../../helpers/getImageUrl'
import { queryRestaurant } from '../../../queries/queryRestaurant'
import { Link } from '../../views/Link'
import { LinkButton } from '../../views/LinkButton'

type Props = {
  escalating?: boolean
  showEscalated?: boolean
  restaurantSlug: string
  onIsAtStart?: (x: boolean) => void
  width: number
  height: number
}

export const RestaurantPhotosRow = (props: Props) => {
  return (
    <VStack height={props.height} minWidth={props.width}>
      <Suspense fallback={null}>
        <RestaurantPhotosRowContent {...props} />
      </Suspense>
    </VStack>
  )
}

export const RestaurantPhotosRowContent = memo(
  graphql(
    ({
      escalating,
      showEscalated,
      restaurantSlug,
      onIsAtStart,
      width,
      height,
    }: Props) => {
      const [restaurant] = queryRestaurant(restaurantSlug)
      const mainPhoto = restaurant.image
      const otherPhotos = restaurant
        .photo_table({
          limit: 6,
          order_by: [
            {
              photo: {
                quality: order_by.desc,
              },
            },
          ],
        })
        .map((x) => x.photo.url)
        .filter(isPresent)

      const photos = mainPhoto ? [mainPhoto, ...otherPhotos] : otherPhotos

      return (
        <HStack>
          {!photos.length && (
            <HStack backgroundColor={bgLight}>
              <Text>No photos!</Text>
            </HStack>
          )}
          {!!photos.length && (
            <>
              {photos.map((url, index) => {
                const photoHeight = escalating
                  ? index < 2
                    ? height
                    : 500
                  : height
                const isEscalated = escalating && index >= 2
                const photoWidth = isEscalated ? width * 1.25 : width
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
                              url,
                              photoWidth * 2,
                              photoHeight * 2,
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
