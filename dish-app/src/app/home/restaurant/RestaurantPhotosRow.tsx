import { graphql, order_by } from '@dish/graph'
import { isPresent } from '@dish/helpers'
import React, { Suspense, memo, useMemo } from 'react'
import { Image } from 'react-native'
import { useConstant } from 'snackui'
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
  graphql(({ escalating, showEscalated, restaurantSlug, onIsAtStart, width, height }: Props) => {
    const [restaurant] = queryRestaurant(restaurantSlug)
    if (!restaurant) {
      return null
    }
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
    const initialWidth = useConstant(() => width)

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
              const photoHeight = escalating ? (index < 2 ? height : 500) : height
              const isEscalated = escalating && index >= 2
              const wScale = isEscalated ? 1.25 : 1
              const containerWidth = width * wScale
              // dont change uri
              const uri = getImageUrl(url, initialWidth * wScale * 1.5, photoHeight * 1.5, 100)
              return (
                <VStack
                  width={containerWidth}
                  height={photoHeight}
                  key={index}
                  className={`scroll-snap-photo`}
                >
                  {(!isEscalated || showEscalated || index === 2) && (
                    <Link name="gallery" params={{ restaurantSlug }}>
                      <Image
                        source={{
                          uri,
                        }}
                        style={{
                          height: photoHeight,
                          width: containerWidth,
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
  })
)
