import { graphql } from '@dish/graph'
import { LoadingItems, XStack, YStack } from '@dish/ui'
import React, { Suspense, memo } from 'react'

import { queryRestaurant } from '../../../queries/queryRestaurant'
import { ContentScrollViewHorizontal } from '../../views/ContentScrollViewHorizontal'
import { Image } from '../../views/Image'
import { Link } from '../../views/Link'

type Props = {
  tagSlug?: string | null
  restaurantSlug: string
}

export const RestaurantTagPhotos = (props: Props) => {
  return (
    <Suspense fallback={<YStack height={220} />}>
      <RestaurantTagPhotosContent {...props} />
    </Suspense>
  )
}

export const RestaurantTagPhotosContent = memo(
  graphql(({ tagSlug, restaurantSlug }: Props) => {
    const [restaurant] = queryRestaurant(restaurantSlug)
    if (!restaurant) {
      return null
    }
    const tag = tagSlug
      ? restaurant.tags({
          where: {
            tag: {
              slug: {
                _eq: tagSlug,
              },
            },
          },
        })[0]
      : null
    const tagPhotos = tag?.photos ?? []
    const numTags = tagPhotos?.length

    if (!numTags) {
      return null
    }

    return (
      <ContentScrollViewHorizontal height={220}>
        <Suspense fallback={<LoadingItems />}>
          <XStack space paddingHorizontal={20} paddingVertical={5}>
            {[...tagPhotos, 0, 0, 0, 0, 0, 0].slice(0, Math.max(numTags, 5)).map((photo, index) => {
              return (
                <Link
                  key={photo || index}
                  name="gallery"
                  params={{
                    restaurantSlug,
                    // tagSlug: tag?.tag?.slug ?? '',
                    offset: index,
                  }}
                >
                  <YStack
                    width={180}
                    height={180}
                    backgroundColor={`rgba(0,0,0,0.0${5 - index})`}
                    borderRadius={35}
                    overflow="hidden"
                  >
                    {!!photo && (
                      <Image
                        source={{ uri: photo }}
                        style={{
                          width: '100%',
                          height: '100%',
                        }}
                      />
                    )}
                  </YStack>
                </Link>
              )
            })}
          </XStack>
        </Suspense>
      </ContentScrollViewHorizontal>
    )
  })
)
