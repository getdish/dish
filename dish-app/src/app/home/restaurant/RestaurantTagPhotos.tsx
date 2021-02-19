import { graphql } from '@dish/graph'
import React, { Suspense, memo } from 'react'
import { Image } from 'react-native'
import { HStack, LoadingItems, VStack } from 'snackui'

import { queryRestaurant } from '../../../queries/queryRestaurant'
import { ContentScrollViewHorizontal } from '../../views/ContentScrollViewHorizontal'
import { Link } from '../../views/Link'

type Props = {
  tagSlug?: string | null
  restaurantSlug: string
}

export const RestaurantTagPhotos = (props: Props) => {
  return (
    <Suspense fallback={<VStack height={220} />}>
      <RestaurantTagPhotosContent {...props} />
    </Suspense>
  )
}

export const RestaurantTagPhotosContent = memo(
  graphql(({ tagSlug, restaurantSlug }: Props) => {
    const [restaurant] = queryRestaurant(restaurantSlug)
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
    const tagPhotos = tag?.photos() ?? []
    const numTags = tagPhotos?.length

    return (
      <ContentScrollViewHorizontal height={220}>
        <Suspense fallback={<LoadingItems />}>
          <HStack spacing="sm" paddingHorizontal={20} paddingVertical={5}>
            {[...tagPhotos, 0, 0, 0, 0, 0, 0]
              .slice(0, Math.max(numTags, 5))
              .map((photo, index) => {
                return (
                  <Link
                    name="gallery"
                    params={{
                      restaurantSlug,
                      tagSlug: tag?.tag?.slug ?? '',
                      offset: index,
                    }}
                  >
                    <VStack
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
                    </VStack>
                  </Link>
                )
              })}
          </HStack>
        </Suspense>
      </ContentScrollViewHorizontal>
    )
  })
)
