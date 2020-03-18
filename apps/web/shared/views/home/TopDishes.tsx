import React, { useEffect } from 'react'
import {
  Image,
  Text,
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native'

import { useOvermind } from '../../state/om'
import top_dish_images from '../../assets/topdishes.json'
import { Spacer } from '../shared/Spacer'
import { SmallTitle } from '../shared/SmallTitle'
import { Link } from '../shared/Link'

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 40,
    alignItems: 'center',
  },
})

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
      style={{ width: 100, height: 100, borderRadius: 20 }}
      resizeMode="cover"
    />
  )
}

export default function TopDishes() {
  const om = useOvermind()
  let dishes: JSX.Element[] = []
  useEffect(() => {
    om.actions.home.getTopDishes()
  }, [])

  for (const dish of om.state.home.top_dishes) {
    const category = dish.category.replace(/"/g, '')
    dishes.push(
      <TouchableOpacity
        key={category}
        style={{
          // flexDirection: 'row',
          alignItems: 'center',
          minWidth: 120,
          width: '33%',
          marginBottom: 20,
        }}
        onPress={() => {
          om.actions.home.setSearchQuery(dish.category.replace(/"/g, ''))
          om.actions.router.navigate({
            name: 'search',
            params: { query: category },
          })
        }}
      >
        {getImageForDish(category)}
        <Spacer />
        <Link to={`/search/${category}`}>
          <Text style={{ textDecorationLine: 'none' }}>{category}</Text>
        </Link>
      </TouchableOpacity>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <SmallTitle>Top Dishes</SmallTitle>
      </View>
      <ScrollView style={{ flex: 1 }}>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
          }}
        >
          {dishes.length != 0 ? dishes : <Text>Loading...</Text>}
        </View>
      </ScrollView>
    </View>
  )
}
