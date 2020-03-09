import React, { useEffect } from 'react'
import { Image, Text, View } from 'react-native'
import { useParams, Link } from 'react-router-dom'

import { useOvermind } from '../../state/om'
import { Restaurant } from '@dish/model'

const styles = {
  container: {},
  header: {
    height: 40,
  },
}

export default function TopRestaurants() {
  const { state, actions } = useOvermind()
  let restaurants: Restaurant[] = []
  const { dish } = useParams()
  if (dish != state.map.current_dish) {
    actions.map.getTopRestaurantsByDish(dish)
  }

  for (const restaurant of state.map.top_restaurants) {
    restaurants.push(
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        <Image
          source={{ uri: restaurant.image }}
          style={{ width: 50, height: 50 }}
          resizeMode="contain"
        />
        <Link to={'/e/' + restaurant.id}>{restaurant.name}</Link>
        <Text> {restaurant.rating}⭐</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={{ fontSize: 30 }}>
          Top {state.map.current_dish} Restaurants
        </Text>
      </View>
      {restaurants.length > 0 ? restaurants : <Text>Loading...</Text>}
    </View>
  )
}
