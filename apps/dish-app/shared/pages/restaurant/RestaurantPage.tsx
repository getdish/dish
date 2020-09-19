import { graphql } from '@dish/graph'
import {
  HStack,
  LoadingItem,
  LoadingItems,
  SmallTitle,
  Spacer,
  VStack,
} from '@dish/ui'
import React, { Suspense, memo } from 'react'
import { Image } from 'react-native'

import { bgLight } from '../../colors'
import { getImageUrl } from '../../helpers/getImageUrl'
import { getMinLngLat } from '../../helpers/getLngLat'
import { usePageLoadEffect } from '../../hooks/usePageLoadEffect'
import { useRestaurantQuery } from '../../hooks/useRestaurantQuery'
import { HomeStateItemRestaurant } from '../../state/home-types'
import { omStatic } from '../../state/omStatic'
import { ContentScrollView } from '../../views/ContentScrollView'
import { RestaurantTagsRow } from '../../views/restaurant/RestaurantTagsRow'
import { StackDrawer } from '../../views/StackDrawer'
import { Link } from '../../views/ui/Link'
import { PageTitleTag } from '../../views/ui/PageTitleTag'
import { SmallLinkButton } from '../../views/ui/SmallButton'
import { StackViewProps } from '../StackViewProps'
import { RestaurantDetailRow } from './RestaurantDetailRow'
import { RestaurantDishPhotos } from './RestaurantDishPhotos'
import { RestaurantHeader } from './RestaurantHeader'
import { RestaurantMenu } from './RestaurantMenu'
import { RestaurantRatingBreakdown } from './RestaurantRatingBreakdown'

type Props = StackViewProps<HomeStateItemRestaurant>

export default function HomePageRestaurantContainer(props: Props) {
  return (
    <StackDrawer closable borderWidth={6} borderColor={bgLight}>
      <HomePageRestaurant {...props} />
    </StackDrawer>
  )
}

const HomePageRestaurant = memo(
  graphql((props: Props) => {
    const { item } = props
    const slug = item.restaurantSlug
    const restaurant = useRestaurantQuery(slug)
    const coords = restaurant?.location?.coordinates

    usePageLoadEffect(props.isActive && restaurant.id, () => {
      omStatic.actions.home.updateHomeState({
        id: item.id,
        type: 'restaurant',
        searchQuery: item.searchQuery,
        restaurantSlug: item.restaurantSlug,
        restaurantId: restaurant.id,
        center: {
          lng: coords?.[0],
          lat: coords?.[1],
        },
        span: getMinLngLat(item.span, 0.0025, 0.0025),
      })
    })

    return (
      <>
        <PageTitleTag>
          Dish - {restaurant?.name ?? ''} has the best [...tags] dishes.
        </PageTitleTag>

        <ContentScrollView paddingTop={0}>
          {/* HEADER */}
          <RestaurantHeader restaurantSlug={slug} />

          <Spacer size="xl" />
          <Spacer size="sm" />

          <Suspense fallback={<LoadingItems />}>
            <VStack alignItems="center">
              <HStack minWidth={380} width="80%">
                <RestaurantDetailRow
                  centered
                  justifyContent="center"
                  restaurantSlug={slug}
                  flex={1}
                />
              </HStack>
            </VStack>

            <Spacer size="xl" />

            <VStack width="100%">
              <Suspense
                fallback={
                  <VStack height={160}>
                    <LoadingItem />
                  </VStack>
                }
              >
                <RestaurantDishPhotos
                  size={160}
                  restaurantSlug={slug}
                  restaurantId={restaurant.id ?? undefined}
                />
              </Suspense>
            </VStack>

            <Spacer />

            <VStack>
              <HStack
                paddingHorizontal="5%"
                flexWrap="wrap"
                alignItems="center"
                justifyContent="center"
              >
                <RestaurantTagsRow
                  size="sm"
                  restaurantSlug={slug}
                  restaurantId={restaurant.id}
                  spacing={8}
                  grid
                  max={5}
                />
              </HStack>
            </VStack>

            <Spacer size="xl" />

            <Suspense fallback={null}>
              <RestaurantRatingBreakdown
                showScoreTable
                restaurantSlug={slug}
                restaurantId={restaurant.id}
              />
            </Suspense>

            <Spacer size="xl" />

            <VStack flex={1} marginBottom={20} width="100%">
              <VStack
                margin={3}
                borderWidth={1}
                borderColor="#eee"
                borderRadius={10}
                padding={10}
              >
                <SmallTitle divider="off">Menu</SmallTitle>
                <Spacer />
                <Suspense fallback={null}>
                  <RestaurantMenu restaurantSlug={slug} />
                </Suspense>
              </VStack>

              <Spacer size="xl" />
            </VStack>

            <VStack maxWidth="100%">
              <VStack paddingHorizontal={10}>
                <SmallTitle>Images</SmallTitle>
                <HStack
                  width="100%"
                  flexWrap="wrap"
                  alignItems="center"
                  justifyContent="center"
                >
                  {(restaurant.photos() ?? []).slice(0, 9).map((photo, key) => (
                    <VStack
                      key={key}
                      width="31%"
                      marginHorizontal={5}
                      marginBottom={10}
                    >
                      <Link
                        width="100%"
                        height="100%"
                        name="gallery"
                        params={{ restaurantSlug: slug }}
                      >
                        <Image
                          source={{ uri: getImageUrl(photo, 280, 180, 100) }}
                          style={{
                            height: 180,
                            width: '100%',
                            borderRadius: 12,
                          }}
                          resizeMode="cover"
                        />
                      </Link>
                    </VStack>
                  ))}
                </HStack>
                <Spacer />
                <SmallLinkButton
                  alignSelf="stretch"
                  name="gallery"
                  params={{ restaurantSlug: slug }}
                >
                  View Gallery
                </SmallLinkButton>
              </VStack>
            </VStack>
          </Suspense>

          {/* bottom space */}
          <VStack height={200} />
        </ContentScrollView>
      </>
    )
  })
)
