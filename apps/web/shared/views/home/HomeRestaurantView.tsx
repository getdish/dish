import React from 'react'
import { Image, Text, View, ScrollView, Linking, FlatList } from 'react-native'

import { useOvermind } from '../../state/om'

import ReviewForm from './ReviewForm'
import { Spacer } from '../shared/Spacer'
import { HStack, VStack } from '../shared/Stacks'
import { Link } from '../shared/Link'
import { SmallTitle } from '../shared/SmallTitle'

export default function HomeRestaurantView() {
  const om = useOvermind()
  const state = om.state.home.currentState

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

  const categories = restaurant.categories || []

  return (
    <ScrollView style={{ padding: 18 }}>
      <VStack>
        <Text style={{ fontSize: 30 }}>{restaurant.name}</Text>

        <Text>{restaurant.rating}⭐</Text>

        <Spacer />

        <Text style={{ fontSize: 15 }}>
          {categories.map((category, index) => (
            <Text key={category}>
              <Link name="search" params={{ query: category }}>
                {category}
              </Link>
              {index == categories.length - 1 ? '' : ', '}
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
        {restaurant.website && (
          <Text onPress={() => Linking.openURL(restaurant.website)}>
            🔗 {restaurant.website}
          </Text>
        )}

        {Object.keys(restaurant.sources).length > 0 && (
          <SmallTitle>Sources</SmallTitle>
        )}
        <FlatList
          data={Object.keys(restaurant.sources).map(i => {
            return {
              source: i,
              url: restaurant.sources[i],
            }
          })}
          renderItem={i => (
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
  )
}
