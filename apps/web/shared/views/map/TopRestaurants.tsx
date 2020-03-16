import React from 'react'
import { StyleSheet, Image, Text, View } from 'react-native'
import { useParams, Link } from 'react-router-dom'

import { useOvermind } from '../../state/om'

const styles = StyleSheet.create({
  container: {},
  header: {
    height: 40,
  },
})

export default function TopRestaurants() {
  const { state, actions } = useOvermind()
  let restaurants: JSX.Element[] = []
  const { dish } = useParams()
  if (dish != state.home.current_dish) {
    actions.home.getTopRestaurantsByDish(dish)
  }

  let key = 0
  for (const restaurant of state.home.top_restaurants) {
    key++
    restaurants.push(
      <View key={key} style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
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
          Top {state.home.current_dish} Restaurants
        </Text>
      </View>
      {restaurants.length > 0 ? restaurants : <Text>Loading...</Text>}
    </View>
  )
}
