import React, { JSX, useEffect } from 'react'
import { Image, Text, View } from 'react-native'
import { Link } from 'react-router-dom'
import { useParams } from 'react-router-dom'

import { useOvermind } from '../../state/om'

import { Restaurant } from '@dish/models'
import ReviewForm from './ReviewForm'

const styles = {
  container: {},
  header: {
    height: 150,
  },
}

export default function RestaurantView() {
  const { state, actions } = useOvermind()
  const { slug } = useParams()
  let restaurant = state.map.current_restaurant
  if (slug != state.map.current_restaurant.id) {
    restaurant = {}
    actions.map.getCurrentRestaurant(slug)
  }
  if (typeof restaurant.name == 'undefined') {
    return <Text>Loading...</Text>
  }
  const categories = restaurant.categories || []
  let images: JSX.Element[] = []
  for (const uri of restaurant.photos) {
    images.push(
      <Image
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
      <Text>
        <Link to={'/best/' + category}>{category}</Link>
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
        <View style={{ width: '50%' }}>
          {state.auth.is_logged_in && <ReviewForm />}
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
