import { graphql } from '@dish/graph'
import {
  Box,
  Button,
  HStack,
  LinearGradient,
  LoadingItems,
  SmallTitle,
  Spacer,
  Text,
  VStack,
} from '@dish/ui'
import React, { Suspense, memo, useState } from 'react'
import { Image, StyleSheet } from 'react-native'

import { HomeStateItemRestaurant } from '../../state/home'
import { PageTitleTag } from '../../views/ui/PageTitleTag'
import { HomePagePaneProps } from './HomePagePane'
import { HomeScrollView } from './HomeScrollView'
import { HomeStackDrawer } from './HomeStackDrawer'
import { RestaurantDetailRow } from './RestaurantDetailRow'
import { RestaurantDishPhotos } from './RestaurantDishPhotos'
// deliverybutton
// favoritestar
import { RestaurantHeader } from './RestaurantHeader'
import { RestaurantOverview } from './RestaurantOverview'
import { RestaurantTagsRow } from './RestaurantTagsRow'
import { RestaurantTopReviews } from './RestaurantTopReviews'
import { thirdPartyCrawlSources } from './thirdPartyCrawlSources'
import { useRestaurantQuery } from './useRestaurantQuery'

type Props = HomePagePaneProps<HomeStateItemRestaurant>

export default memo(function HomePageRestaurantContainer(props: Props) {
  return (
    <HomeStackDrawer closable>
      <HomePageRestaurant {...props} />
    </HomeStackDrawer>
  )
})

const HomePageRestaurant = memo(
  graphql(({ item }: Props) => {
    if (!item) {
      return null
    }
    const slug = item.restaurantSlug
    const restaurant = useRestaurantQuery(slug)
    // const isCanTag =
    //   om.state.user.isLoggedIn &&
    //   (om.state.user.user.role == 'admin' ||
    //     om.state.user.user.role == 'contributor')

    return (
      <>
        <PageTitleTag>
          Dish - {restaurant?.name ?? ''} has the best [...tags] dishes.
        </PageTitleTag>

        <HomeScrollView paddingTop={0}>
          {/* HEADER */}
          <RestaurantHeader restaurantSlug={slug} />

          <Spacer size="xl" />
          <Spacer size="sm" />

          <Suspense fallback={<LoadingItems />}>
            <VStack alignItems="center">
              <HStack minWidth={380}>
                <RestaurantDetailRow
                  centered
                  justifyContent="center"
                  restaurantSlug={slug}
                  flex={1}
                />
              </HStack>
            </VStack>

            <Spacer size="lg" />

            <Box
              borderWidth={1}
              borderColor="#eee"
              padding={0}
              marginHorizontal={20}
            >
              <HStack backgroundColor="#f9f9f9">
                <RestaurantRatingBreakdown restaurantSlug={slug} />
              </HStack>
              <HStack padding={10}>
                <RestaurantOverview restaurantSlug={slug} />
              </HStack>
            </Box>

            <Spacer size="lg" />

            <VStack paddingHorizontal={14}>
              <VStack alignItems="center">
                <Suspense fallback={null}>
                  <RestaurantDishPhotos restaurantSlug={slug} />
                </Suspense>

                <Spacer size="xl" />

                <RestaurantTagsRow
                  size="sm"
                  restaurantSlug={slug}
                  restaurantId={restaurant.id}
                />

                <Spacer size="xl" />

                <VStack flex={1} marginBottom={20}>
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

                  <SmallTitle>Tips</SmallTitle>
                  <RestaurantTopReviews
                    expandTopComments={2}
                    restaurantId={restaurant.id}
                  />
                </VStack>

                {/* <VStack width="100%">
                <SmallTitle>Images</SmallTitle>
                <HStack
                  width="100%"
                  flexWrap="wrap"
                  alignItems="center"
                  justifyContent="center"
                >
                  {(restaurant.photos() ?? [])
                    .slice(0, 10)
                    .map((photo, key) => (
                      <Image
                        key={key}
                        source={{ uri: photo }}
                        style={{
                          height: 180,
                          width: '31%',
                          marginRight: 10,
                          marginBottom: 10,
                          borderRadius: 12,
                        }}
                        resizeMode="cover"
                      />
                    ))}
                </HStack>
              </VStack> */}
              </VStack>
            </VStack>
          </Suspense>

          {/* bottom space */}
          <VStack height={200} />
        </HomeScrollView>
      </>
    )
  })
)

export const RestaurantRatingBreakdown = memo(
  graphql(({ restaurantSlug }: { restaurantSlug: string }) => {
    const restaurant = useRestaurantQuery(restaurantSlug)
    const sources = restaurant?.sources?.() ?? {}
    return (
      <>
        {Object.keys(sources).map((source, i) => {
          const item = sources[source]
          if (!item) {
            return null
          }
          const info = thirdPartyCrawlSources[source]
          return (
            <a
              className="see-through"
              style={{ flex: 1 }}
              key={source}
              href={item.url}
              target="_blank"
            >
              <VStack
                padding={10}
                alignItems="center"
                flex={1}
                borderRadius={10}
                margin={3}
                hoverStyle={{
                  backgroundColor: '#fff',
                }}
                // onPress={() => Linking.openURL(item.url)}
              >
                {info?.image ? (
                  <Image
                    source={info.image}
                    style={{ width: 24, height: 24, borderRadius: 100 }}
                  />
                ) : null}
                <Text fontSize={12} opacity={0.5} marginVertical={3}>
                  {info?.name ?? source}
                </Text>
                <Text>{item.rating ?? '-'}</Text>
              </VStack>
            </a>
          )
        })}
      </>
    )
  })
)

const RestaurantMenu = memo(
  graphql(({ restaurantSlug }: { restaurantSlug: string }) => {
    const [isExpanded, setIsExpanded] = useState(false)
    const restaurant = useRestaurantQuery(restaurantSlug)
    const items = restaurant.menu_items({ limit: 40 })
    return (
      <>
        {!items?.length && (
          <VStack>
            <Text>No menu found.</Text>
          </VStack>
        )}
        {!!items?.length && (
          <VStack position="relative">
            <HStack
              height={isExpanded ? 'auto' : 120}
              overflow="hidden"
              spacing={3}
              flexWrap="wrap"
            >
              {items.slice(0, isExpanded ? Infinity : 8).map((item, i) => (
                <VStack
                  minWidth={200}
                  paddingBottom={10}
                  borderBottomWidth={1}
                  marginBottom={10}
                  borderBottomColor="#f2f2f2"
                  flex={1}
                  overflow="hidden"
                  paddingVertical={4}
                  key={i}
                >
                  <Text fontSize={14}>{item.name}</Text>
                  <Text fontSize={13} opacity={0.5}>
                    {item.description}
                  </Text>
                </VStack>
              ))}
            </HStack>
            {!isExpanded && (
              <LinearGradient
                colors={['rgba(255,255,255,0)', '#fff']}
                style={[StyleSheet.absoluteFill]}
              />
            )}
            <Button
              marginTop={-5}
              zIndex={100}
              position="relative"
              alignSelf="center"
              onPress={() => {
                setIsExpanded((x) => !x)
              }}
            >
              <Text fontWeight="800" fontSize={13}>
                {isExpanded ? 'Close' : 'Expand'}
              </Text>
            </Button>
          </VStack>
        )}
      </>
    )
  })
)
