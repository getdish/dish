import { graphql } from '@dish/graph'
import React, { Suspense, memo } from 'react'
import { HStack, Spacing, Text, VStack, useConstant, useTheme } from 'snackui'

import { bgLight } from '../../../constants/colors'
import { getImageUrl } from '../../../helpers/getImageUrl'
import { queryRestaurant } from '../../../queries/queryRestaurant'
import { Image } from '../../views/Image'
import { Link } from '../../views/Link'
import { LinkButton } from '../../views/LinkButton'
import { SimpleCard, SkewedCardCarousel } from '../SimpleCard'
import { useRestaurantPhotos } from './useRestaurantPhotos'

type Props = {
  escalating?: boolean
  showEscalated?: boolean
  restaurantSlug: string
  width: number
  height: number
  spacing?: Spacing
  floating?: boolean
}

export const RestaurantPhotosRow = (props: Props) => {
  return (
    <VStack
      position="relative"
      zIndex={0}
      overflow="hidden"
      height={props.height}
      minWidth={props.width}
    >
      <Suspense fallback={null}>
        <RestaurantPhotosRowContent {...props} />
      </Suspense>
    </VStack>
  )
}

export const RestaurantPhotosRowContent = memo(
  graphql(
    ({ escalating, showEscalated, restaurantSlug, width, height, spacing, floating }: Props) => {
      const [restaurant] = queryRestaurant(restaurantSlug)
      const initialWidth = useConstant(() => width)
      const { photos } = useRestaurantPhotos(restaurant)
      const photosData = photos.map((url, index) => {
        const photoHeight = escalating ? (index < 2 ? height : 500) : height
        const isEscalated = escalating && index >= 3
        const wScale = isEscalated ? 1.25 : 1
        const photoWidth = width * wScale
        // dont change uri
        const uri = getImageUrl(url || '', initialWidth * wScale, photoHeight, 100)
        return { uri, height: photoHeight, width: photoWidth, isEscalated }
      })
      const fullWidth = photosData.reduce((a, b) => a + b.width, 0)
      const theme = useTheme()
      // console.log('photosData', JSON.stringify(photosData, null, 2))

      if (!restaurant) {
        return null
      }

      return (
        // an attempt to get native to scroll but not working
        <HStack spacing={spacing} minWidth={fullWidth}>
          {!photos.length && (
            <HStack backgroundColor={bgLight}>
              <Text>No photos!</Text>
            </HStack>
          )}
          {!!photos.length && (
            <SkewedCardCarousel>
              {[
                ...photosData,
                {
                  content: (
                    <LinkButton
                      width={width}
                      height={height}
                      name="gallery"
                      alignSelf="center"
                      params={{ restaurantSlug }}
                      textProps={{
                        textAlign: 'center',
                        fontSize: 28,
                        fontWeight: '800',
                      }}
                    >
                      Gallery 🖼
                    </LinkButton>
                  ),
                },
              ].map((item, index) => {
                return (
                  <SimpleCard
                    zIndex={1000 - index}
                    slanted
                    isBehind={index > 0}
                    width={width}
                    height={height}
                    key={index}
                    marginRight={-40}
                    {...(floating && {
                      borderRadius: 12,
                      overflow: 'hidden',
                      shadowColor: theme.shadowColorLighter,
                      shadowRadius: 7,
                      shadowOffset: { width: 4, height: 2 },
                    })}
                  >
                    {(() => {
                      if ('content' in item) {
                        return item.content
                      }
                      const { uri, width, height, isEscalated } = item
                      return (
                        <>
                          {(!isEscalated || showEscalated) && (
                            <Link name="gallery" params={{ restaurantSlug, offset: index }}>
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
                        </>
                      )
                    })()}
                  </SimpleCard>
                )
              })}
            </SkewedCardCarousel>
          )}
        </HStack>
      )
    }
  )
)
