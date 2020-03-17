import React from 'react'
import { Image, Text, View, ScrollView, TouchableOpacity } from 'react-native'
import { useParams, Link, useHistory } from 'react-router-dom'

import { useOvermind } from '../../state/om'

import { Restaurant } from '@dish/models'
import ReviewForm from './ReviewForm'
import { Spacer } from '../shared/Spacer'
import { HStack, VStack } from '../shared/Stacks'

export default function RestaurantView() {
  const { state, actions } = useOvermind()
  const { slug } = useParams()
  const history = useHistory()

  let restaurant = state.home.current_restaurant
  if (slug != state.home.current_restaurant.id) {
    restaurant = {} as Restaurant
    actions.home.setCurrentRestaurant(slug)
  }
  if (typeof restaurant.name == 'undefined') {
    return <Text>Loading...</Text>
  }

  const categories = restaurant.categories || []
  const canGoBack = history.length > 2

  return (
    <ScrollView style={{ padding: 18 }}>
      <VStack>
        {/* <Link
          to="/"
          style={{ alignSelf: 'flex-start', opacity: 0.5, fontSize: 12 }}
        > */}
        <TouchableOpacity
          onPress={e => {
            if (canGoBack) {
              e.preventDefault()
              e.stopPropagation()
              history.goBack()
            }
          }}
        >
          <Text>◀ Back to Top Dishes</Text>
        </TouchableOpacity>
        {/* </Link> */}

        <Spacer />

        <Text style={{ fontSize: 30 }}>{restaurant.name}</Text>

        <Text>{restaurant.rating}⭐</Text>

        <Spacer />

        <Text style={{ fontSize: 15 }}>
          {categories.map((category, index) => (
            <Text key={category}>
              <Link to={'/best/' + category}>{category}</Link>
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
          {state.auth.is_logged_in && <ReviewForm />}
        </View>
        <View>
          <Text style={{ fontSize: 15 }}>Latest Reviewers</Text>
          {state.home.restaurant_reviews.map((review, i) => {
            return (
              <Text key={i}>
                <Link to={'/user/' + review.user.id + '/reviews'}>
                  {review.user.username}
                </Link>
                {i == state.home.restaurant_reviews.length - 1 ? '' : ', '}
              </Text>
            )
          })}
        </View>
      </View>
      <View>
        <HStack height={100}>
          {restaurant.photos.map((photo, key) => (
            <Image
              key={key}
              source={{ uri: photo }}
              style={{ height: 100, width: 100 }}
              resizeMode="cover"
            />
          ))}
        </HStack>
      </View>
    </ScrollView>
  )
}
