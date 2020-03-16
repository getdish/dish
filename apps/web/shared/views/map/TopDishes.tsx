import React, { useEffect } from 'react'
import { Image, Text, View } from 'react-native'
import { Link } from 'react-router-dom'

import { useOvermind } from '../../state/om'
import top_dish_images from '../../assets/topdishes.json'

const styles = {
  container: {},
  header: {
    height: 40,
  },
}

const getImageForDish = (dish: string) => {
  let image: string
  for (const item of top_dish_images) {
    if (item.name == `"${dish}"`) {
      image = item.image
    }
  }
  return (
    <Image
      source={{ uri: image }}
      style={{ width: 50, height: 50 }}
      resizeMode="contain"
    />
  )
}

export default function TopDishes() {
  const { state, actions } = useOvermind()
  let dishes: string[] = []
  useEffect(() => {
    actions.home.getTopDishes()
  }, [])

  for (const dish of state.home.top_dishes) {
    const category = dish.category.replace(/"/g, '')
    dishes.push(
      <Text>
        {getImageForDish(category)}
        <Link to={`/best/${category}`}>{category}</Link>
      </Text>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={{ fontSize: 30 }}>Top Dishes</Text>
      </View>
      {dishes.length != 0 ? dishes : <Text>Loading...</Text>}
    </View>
  )
}
