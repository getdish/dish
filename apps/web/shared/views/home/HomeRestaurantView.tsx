import React from 'react'
import { Image, Text, View, ScrollView, Linking, FlatList } from 'react-native'

import { useOvermind } from '../../state/om'

import ReviewForm from './ReviewForm'
import { Spacer } from '../shared/Spacer'
import { HStack, VStack, ZStack } from '../shared/Stacks'
import { Link, LinkButton } from '../shared/Link'
import { SmallTitle } from '../shared/SmallTitle'
import { HomeStateItem } from '../../state/home'
import { CloseButton } from './CloseButton'
import { RatingView } from './RatingView'
import {
  RestaurantRatingDetail,
  RestaurantRateRow,
  RestaurantMetaRow,
  RestaurantDetailRow,
} from './RestaurantListItem'
import { Divider } from '../shared/Divider'

export default function HomeRestaurantView({
  state,
}: {
  state: HomeStateItem
}) {
  const om = useOvermind()
  if (state.type !== 'restaurant') {
    return null
  }
  if (!state.restaurant) {
    return null
  }
  const restaurant = state.restaurant
  if (typeof restaurant.name == 'undefined') {
    return <Text>Loading...</Text>
  }

  const tags = restaurant.tags.map((i) => i.taxonomy.name) ?? []
  const sources = restaurant.sources ?? []

  return (
    <VStack>
      <ZStack right={10} top={10} pointerEvents="auto" zIndex={100}>
        <CloseButton onPress={() => om.actions.home.popTo(-1)} />
      </ZStack>
      <ScrollView style={{ padding: 18 }}>
        <VStack>
          <HStack marginBottom={-10}>
            <Text style={{ fontSize: 30 }}>{restaurant.name}</Text>

            <Spacer flex />

            <RestaurantRatingDetail restaurant={restaurant} />

            <Spacer size={30} />
          </HStack>

          <RestaurantRateRow restaurant={restaurant} />
          <Spacer />
          <RestaurantMetaRow restaurant={restaurant} />
          <Spacer />
          <Divider />
          <Spacer />
          <RestaurantDetailRow restaurant={restaurant} />
          <Spacer />

          {!!restaurant.image && (
            <VStack>
              <SmallTitle>Best Dishes</SmallTitle>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ marginHorizontal: -18 }}
              >
                <HStack paddingHorizontal={20} paddingVertical={26}>
                  {['Pho', 'Banh Mi', 'Banh Xeo', 'Bho Kho', 'Thit Kho'].map(
                    (dish) => (
                      <React.Fragment key={dish}>
                        <VStack alignItems="center">
                          <VStack
                            marginVertical={-15}
                            zIndex={100}
                            backgroundColor="#eee"
                            paddingVertical={8}
                            paddingHorizontal={10}
                            borderRadius={10}
                            shadowColor="rgba(0,0,0,0.2)"
                            shadowRadius={6}
                          >
                            <Text>{dish}</Text>
                          </VStack>
                          <Image
                            source={{
                              uri: restaurant.image,
                              width: 200,
                              height: 200,
                            }}
                            style={{
                              borderRadius: 20,
                              shadowColor: 'rgba(0,0,0,0.2)',
                              shadowRadius: 6,
                            }}
                          />
                        </VStack>
                        <Spacer />
                      </React.Fragment>
                    )
                  )}
                </HStack>
              </ScrollView>

              <HStack justifyContent="center">
                <LinkButton name="restaurant">🖼 Inside</LinkButton>
                <Spacer />
                <LinkButton name="restaurant">🖼 Outside</LinkButton>
                <Spacer />
                <LinkButton name="restaurant">🖼 Menu</LinkButton>
              </HStack>
            </VStack>
          )}

          <Text style={{ fontSize: 15 }}>
            {tags.map((tag, index) => (
              <Text key={tag}>
                <Link name="search" params={{ query: tag }}>
                  {tag}
                </Link>
                {index == tags.length - 1 ? '' : ', '}
              </Text>
            ))}
          </Text>
        </VStack>

        <Spacer size="lg" />

        <View style={{ flexDirection: 'row' }}>
          <Image
            source={{ uri: restaurant.image }}
            style={{ height: 200, width: '100%' }}
            resizeMode="cover"
          />
          <View style={{ width: '30%' }}>
            {om.state.auth.is_logged_in && <ReviewForm />}
          </View>
          <View>
            <Text style={{ fontSize: 15 }}>Latest Reviewers</Text>
            {(state.reviews ?? []).map((review, i) => {
              return (
                <Text key={i}>
                  <Link
                    name="user"
                    params={{ id: review.user.id, pane: 'reviews' }}
                  >
                    {review.user.username}
                  </Link>
                  {i == state.reviews.length - 1 ? '' : ', '}
                </Text>
              )
            })}
          </View>
        </View>
        <View>
          <HStack height={100}>
            {(restaurant.photos ?? []).map((photo, key) => (
              <Image
                key={key}
                source={{ uri: photo }}
                style={{ height: 100, width: 100 }}
                resizeMode="cover"
              />
            ))}
          </HStack>
        </View>
        <View>
          {!!restaurant.website && (
            <Text onPress={() => Linking.openURL(restaurant.website)}>
              🔗 {restaurant.website}
            </Text>
          )}

          {Object.keys(sources).length > 0 && <SmallTitle>Sources</SmallTitle>}
          <FlatList
            data={Object.keys(sources).map((i) => {
              return {
                source: i,
                url: sources[i],
              }
            })}
            renderItem={(i) => (
              <Text
                key={i.item.source}
                onPress={() => Linking.openURL(i.item.url)}
              >
                🔗 {i.item.source}
              </Text>
            )}
          ></FlatList>
        </View>
      </ScrollView>
    </VStack>
  )
}
