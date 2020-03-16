import React from 'react'
import { StyleSheet, Image, Text, View } from 'react-native'
import { useParams, Link } from 'react-router-dom'

import { useOvermind } from '../../state/om'

import { Restaurant } from '@dish/models'
import ReviewForm from './ReviewForm'

const styles = StyleSheet.create({
  container: {},
  header: {
    height: 150,
  },
})

export default function RestaurantView() {
  const { state, actions } = useOvermind()
  const { slug } = useParams()
  let restaurant = state.home.current_restaurant
  if (slug != state.home.current_restaurant.id) {
    restaurant = {} as Restaurant
    actions.home.getCurrentRestaurant(slug)
  }
  if (typeof restaurant.name == 'undefined') {
    return <Text>Loading...</Text>
  }
  const categories = restaurant.categories || []
  let images: JSX.Element[] = []
  let reviewer_links: JSX.Element[] = []
  let key = 0
  for (const uri of restaurant.photos) {
    key++
    images.push(
      <Image
        key={key}
        source={{ uri: uri }}
        style={{ height: 100 }}
        resizeMode="contain"
      />
    )
  }
  let categories_links: JSX.Element[] = []
  for (let i = 0; i < categories.length; i++) {
    const category = categories[i]
    const separator = i == categories.length - 1 ? '' : ', '
    categories_links.push(
      <Text key={category}>
        <Link to={'/best/' + category}>{category}</Link>
        {separator}
      </Text>
    )
  }
  for (let i = 0; i < state.home.restaurant_reviews.length; i++) {
    const review = state.home.restaurant_reviews[i]
    const separator = i == state.home.restaurant_reviews.length - 1 ? '' : ', '
    reviewer_links.push(
      <Text key={i}>
        <Link to={'/user/' + review.user.id + '/reviews'}>
          {review.user.username}
        </Link>
        {separator}
      </Text>
    )
  }
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={{ fontSize: 30 }}>
          {restaurant.name} // {restaurant.rating}⭐
        </Text>
        <Text style={{ fontSize: 15 }}>{categories_links}</Text>
        <Link to="/" style={{ alignSelf: 'flex-end' }}>
          Back to Top Dishes
        </Link>
      </View>
      <View style={{ flexDirection: 'row' }}>
        <Image
          source={{ uri: restaurant.image }}
          style={{ height: 200, width: 300 }}
          resizeMode="contain"
        />
        <View style={{ width: '30%' }}>
          {state.auth.is_logged_in && <ReviewForm />}
        </View>
        <View>
          <Text style={{ fontSize: 15 }}>Latest Reviewers</Text>
          {reviewer_links}
        </View>
      </View>
      <View>
        {images}
        <Text>{restaurant.address}</Text>
        <Text>{restaurant.telephone}</Text>
        <Text>{restaurant.website}</Text>
      </View>
    </View>
  )
}
