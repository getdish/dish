import { graphql, restaurant } from '@dish/graph'
import { isPresent } from '@dish/helpers'
import { XStack, YStack, useConstant } from '@dish/ui'
import React, { Suspense, memo } from 'react'

import { getImageUrl } from '../../../helpers/getImageUrl'
import { Image } from '../../views/Image'
import { Link } from '../../views/Link'
import { LinkButton } from '../../views/LinkButton'
import { SimpleCard, SimpleCardProps, SkewedCardCarousel } from '../SimpleCard'
import { useRestaurantPhotos } from './useRestaurantPhotos'

type Props = {
  escalating?: boolean
  showEscalated?: boolean
  restaurant?: restaurant
  width: number
  height: number
  space?: any
  floating?: boolean
  max?: number
  slanted?: boolean
}

export const RestaurantPhotosRow = (props: Props) => {
  return (
    <Suspense
      fallback={
        <YStack height={props.height}>
          <PhotoCard {...props} />
        </YStack>
      }
    >
      <RestaurantPhotosRowContent {...props} />
    </Suspense>
  )
}

export const RestaurantPhotosRowContent = memo(
  graphql(
    ({
      escalating,
      slanted,
      showEscalated,
      restaurant,
      width,
      height,
      space,
      floating,
      max,
    }: Props) => {
      const initialWidth = useConstant(() => width)
      const { photos } = useRestaurantPhotos(restaurant)
      const photosData = photos.slice(0, max ?? Infinity).map((url, index) => {
        const photoHeight = escalating ? (index < 2 ? height : 500) : height
        const isEscalated = escalating && index >= 3
        const wScale = isEscalated ? 1.25 : 1
        const photoWidth = width * wScale
        // dont change uri
        const uri = getImageUrl(url || '', initialWidth * wScale, photoHeight, 100)
        return { uri, height: photoHeight, width: photoWidth, isEscalated }
      })
      const fullWidth = photosData.reduce((a, b) => a + b.width, 0)
      // console.log('photosData', JSON.stringify(photosData, null, 2))

      if (!restaurant) {
        return null
      }

      const restaurantSlug = restaurant.slug || ''
      const photoCardProps = {
        floating,
        width,
        height,
        slanted,
      }

      const contents = [
        ...photosData,
        // @ts-ignore
        max > 3
          ? {
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
            }
          : null,
      ]
        .filter(isPresent)
        .map((item, index) => {
          return (
            <PhotoCard
              {...photoCardProps}
              // marginRight={slanted ? -width * 0.3 : 0}
              zIndex={1000 - index}
              isBehind={index > 0}
              key={index}
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
            </PhotoCard>
          )
        })

      return (
        // an attempt to get native to scroll but not working
        <XStack space={space} minWidth={fullWidth}>
          {slanted ? <SkewedCardCarousel>{contents}</SkewedCardCarousel> : contents}
        </XStack>
      )
    }
  )
)

const PhotoCard = (props: SimpleCardProps & { floating?: boolean }) => {
  // const theme = useTheme()
  return (
    <SimpleCard
      {...(props.floating && {
        borderRadius: 12,
        overflow: 'hidden',
        // shadowColor: theme.shadowColor2,
      })}
      {...props}
    />
  )
}
