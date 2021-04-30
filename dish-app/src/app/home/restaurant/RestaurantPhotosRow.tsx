import { graphql, order_by } from '@dish/graph'
import { isPresent } from '@dish/helpers'
import React, { Suspense, memo, useMemo } from 'react'
import { useConstant } from 'snackui'
import { HStack, Text, VStack } from 'snackui'

import { bgLight } from '../../../constants/colors'
import { getImageUrl } from '../../../helpers/getImageUrl'
import { queryRestaurant } from '../../../queries/queryRestaurant'
import { Image } from '../../views/Image'
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

    const photosData = photos.map((url, index) => {
      const photoHeight = escalating ? (index < 2 ? height : 500) : height
      const isEscalated = escalating && index >= 2
      const wScale = isEscalated ? 1.25 : 1
      const photoWidth = width * wScale
      // dont change uri
      const uri = getImageUrl(url, initialWidth * wScale * 1.5, photoHeight * 1.5, 100)
      return { uri, height: photoHeight, width: photoWidth, isEscalated }
    })

    const fullWidth = photosData.reduce((a, b) => a + b.width, 0)
    return (
      // an attempt to get native to scroll but not working
      <HStack minWidth={fullWidth}>
        {!photos.length && (
          <HStack backgroundColor={bgLight}>
            <Text>No photos!</Text>
          </HStack>
        )}
        {!!photos.length && (
          <>
            {photosData.map(({ uri, width, height, isEscalated }, index) => {
              return (
                <VStack width={width} height={height} key={index} className={`scroll-snap-photo`}>
                  {(!isEscalated || showEscalated || index === 2) && (
                    <Link name="gallery" params={{ restaurantSlug }}>
                      <Image
                        source={{
                          uri,
                        }}
                        style={{
                          height,
                          width,
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
