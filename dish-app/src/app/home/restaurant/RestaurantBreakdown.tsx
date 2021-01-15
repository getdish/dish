import { graphql, query } from '@dish/graph'
import { Store, useStore } from '@dish/use-store'
import React, { Suspense, memo } from 'react'
import { Image } from 'react-native'
import {
  AbsoluteVStack,
  HStack,
  LoadingItems,
  SmallTitle,
  Spacer,
  Text,
  VStack,
  useMedia,
} from 'snackui'

import { bgLight } from '../../../constants/colors'
import { listItemMaxSideWidth } from '../../../constants/constants'
import { queryRestaurant } from '../../../queries/queryRestaurant'
import { CloseButton } from '../../views/CloseButton'
import { SlantedTitle } from '../../views/SlantedTitle'
import { RestaurantAddCommentButton } from './RestaurantAddCommentButton'
import { RestaurantPointsBreakdown } from './RestaurantPointsBreakdown'
import { RestaurantSourcesOverview } from './RestaurantSourcesOverview'

export class RestaurantReviewsDisplayStore extends Store<{ id: string }> {
  showComments = false

  toggleShowComments() {
    this.showComments = !this.showComments
  }
}

export const RestaurantBreakdown = memo(
  graphql(
    ({
      tagSlug,
      restaurantId,
      restaurantSlug,
      closable,
      borderless,
      showScoreTable,
    }: {
      title?: string
      tagSlug?: string | null
      restaurantId: string
      restaurantSlug: string
      closable?: boolean
      showScoreTable?: boolean
      borderless?: boolean
    }) => {
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
      const tagName = tag?.tag?.displayName ?? tag?.tag?.name ?? null
      const media = useMedia()
      const store = useStore(RestaurantReviewsDisplayStore, {
        id: restaurantId,
      })
      const tagPhotos = tag?.photos() ?? []
      const hasTagPhotos = tagPhotos?.length > 0

      return (
        <VStack
          overflow="hidden"
          maxWidth="100%"
          width="100%"
          position="relative"
        >
          <HStack
            position="relative"
            marginHorizontal={10}
            marginBottom={-10}
            alignItems="center"
            justifyContent="center"
          >
            <SlantedTitle fontWeight="700">{tagName ?? 'Overall'}</SlantedTitle>
          </HStack>
          {closable && (
            <AbsoluteVStack zIndex={1000} top={10} right={10}>
              <CloseButton onPress={store.toggleShowComments} />
            </AbsoluteVStack>
          )}
          <HStack
            flexWrap={media.sm ? 'wrap' : 'nowrap'}
            overflow="hidden"
            flex={1}
            maxWidth="100%"
            margin={10}
            minWidth={300}
            borderWidth={borderless ? 0 : 1}
            borderColor="#eee"
            borderRadius={12}
            paddingVertical={18}
            justifyContent="center"
          >
            <VStack
              minWidth={260}
              // maxWidth={drawerWidthMax / 2 - 40}
              flex={2}
              overflow="hidden"
              paddingHorizontal={10}
              paddingVertical={20}
              alignItems="center"
              spacing={10}
            >
              <Suspense fallback={<LoadingItems />}>
                <RestaurantSourcesOverview
                  tagName={tagName}
                  restaurantSlug={restaurantSlug}
                />
              </Suspense>
            </VStack>

            {!!(tagName && hasTagPhotos) && (
              <VStack
                borderRadius={10}
                borderWidth={1}
                borderColor="#eee"
                maxWidth={media.sm ? '100%' : listItemMaxSideWidth}
                padding={10}
                minWidth={220}
                margin={10}
                width={media.sm ? '100%' : '33%'}
                backgroundColor={bgLight}
                overflow="hidden"
              >
                <Suspense fallback={<LoadingItems />}>
                  <SmallTitle>{tagName}</SmallTitle>

                  <HStack
                    alignItems="center"
                    justifyContent="center"
                    flexWrap="wrap"
                  >
                    {tagPhotos.map((photo) => {
                      return (
                        <VStack key={photo} width={110} height={110} margin={5}>
                          <Image
                            source={{ uri: photo }}
                            style={{
                              width: '100%',
                              height: '100%',
                            }}
                          />
                        </VStack>
                      )
                    })}
                  </HStack>
                </Suspense>
              </VStack>
            )}
          </HStack>
        </VStack>
      )
    }
  )
)
