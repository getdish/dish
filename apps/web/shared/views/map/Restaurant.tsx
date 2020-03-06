import React, { JSX } from 'react'
import { Image, Text, View } from 'react-native'

import { useOvermind } from '../../state/om'

const styles = {
  container: {},
  header: {
    height: 150,
  },
}

export default function Restaurant() {
  const { state, actions } = useOvermind()
  const restaurant = state.map.selected.model
  if (typeof restaurant.name == 'undefined') {
    return null
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
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={{ fontSize: 30 }}>{restaurant.name} ⭐⭐⭐⭐</Text>
        <Text style={{ fontSize: 15 }}>{categories.join(', ')}</Text>
      </View>
      <View>
        <Image
          source={{ uri: restaurant.image }}
          style={{ height: 200 }}
          resizeMode="contain"
        />
      </View>
      {images}
      <Text>{restaurant.address}</Text>
      <Text>{restaurant.telephone}</Text>
      <Text>{restaurant.website}</Text>
    </View>
  )
}
