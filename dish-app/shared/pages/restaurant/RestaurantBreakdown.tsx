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
} from 'snackui'

import { graphql } from '../../../../packages/graph/_'
import { bgLight } from '../../colors'
import { drawerWidthMax } from '../../constants'
import { useIsNarrow } from '../../hooks/useIs'
import { useRestaurantQuery } from '../../hooks/useRestaurantQuery'
import { CloseButton } from '../../views/ui/CloseButton'
import { SlantedTitle } from '../../views/ui/SlantedTitle'
import { RestaurantAddCommentButton } from './RestaurantAddCommentButton'
import { RestaurantPointsBreakdown } from './RestaurantPointsBreakdown'
import { RestaurantSourcesOverview } from './RestaurantSourcesOverview'

export class RestaurantReviewsDisplayStore extends Store<{ id: string }> {
  showComments = false

  toggleShowComments() {
    this.showComments = !this.showComments
  }
}

const maxSideWidth = drawerWidthMax / 2.5 - 40

export const RestaurantBreakdown = memo(
  ({
    tagName,
    restaurantId,
    restaurantSlug,
    closable,
    borderless,
    showScoreTable,
  }: {
    title?: string
    tagName?: string | null
    restaurantId: string
    restaurantSlug: string
    closable?: boolean
    showScoreTable?: boolean
    borderless?: boolean
  }) => {
    console.log('tagName', tagName)
    const isSmall = useIsNarrow()
    const store = useStore(RestaurantReviewsDisplayStore, { id: restaurantId })

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
          <SlantedTitle fontWeight="700">{tagName ?? 'Overview'}</SlantedTitle>

          <AbsoluteVStack top={0} right={0}>
            <Suspense fallback={null}>
              <RestaurantAddCommentButton
                restaurantId={restaurantId}
                restaurantSlug={restaurantSlug}
              />
            </Suspense>
          </AbsoluteVStack>
        </HStack>
        {closable && (
          <AbsoluteVStack zIndex={1000} top={10} right={10}>
            <CloseButton onPress={store.toggleShowComments} />
          </AbsoluteVStack>
        )}
        <HStack
          flexWrap={isSmall ? 'wrap' : 'nowrap'}
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

          <VStack
            borderRadius={10}
            borderWidth={1}
            borderColor="#eee"
            maxWidth={isSmall ? 400 : maxSideWidth}
            padding={10}
            minWidth={220}
            margin={10}
            width="33%"
            backgroundColor={bgLight}
            overflow="hidden"
          >
            <Suspense fallback={<LoadingItems />}>
              {!!tagName && (
                <>
                  <SmallTitle>{tagName}</SmallTitle>
                  <Spacer />
                  <RestaurantTagPhotos
                    tagName={tagName}
                    restaurantSlug={restaurantSlug}
                  />
                  <Spacer />
                </>
              )}
              {!tagName && (
                <>
                  <SmallTitle>Base Score</SmallTitle>
                  <RestaurantPointsBreakdown
                    showTable={showScoreTable}
                    restaurantSlug={restaurantSlug}
                    restaurantId={restaurantId}
                  />
                </>
              )}
            </Suspense>
          </VStack>
        </HStack>
      </VStack>
    )
  }
)

const RestaurantTagPhotos = graphql(
  ({
    tagName,
    restaurantSlug,
  }: {
    restaurantSlug: string
    tagName: string
  }) => {
    const restaurant = useRestaurantQuery(restaurantSlug)
    const tag = restaurant.tags({
      where: {
        tag: {
          name: {
            _eq: tagName,
          },
        },
      },
    })[0]
    const tagPhotos = tag?.photos() ?? []

    if (!tagPhotos.length) {
      return (
        <VStack minHeight={200} alignItems="center" justifyContent="center">
          <Text>No photos</Text>
        </VStack>
      )
    }

    return (
      <HStack alignItems="center" justifyContent="center" flexWrap="wrap">
        {tagPhotos.map((photo) => {
          console.log('photo', photo)
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
    )
  }
)
