import React, { useEffect } from 'react'
import { StyleSheet, Text, View, ScrollView } from 'react-native'

import { useOvermind } from '../../state/om'
import { RestaurantListItem } from './RestaurantListItem'
import { SmallTitle } from '../shared/SmallTitle'
import { VStack } from '../shared/Stacks'

const styles = StyleSheet.create({
  container: {},
  header: {
    height: 40,
    alignItems: 'center',
  },
})

export default function TopRestaurants() {
  const om = useOvermind()
  const dish = `${om.state.router.curPage.params.dish}`

  useEffect(() => {
    if (dish != om.state.home.current_dish) {
      om.actions.home.navigateToSearch(dish)
    }
  }, [dish])

  const topRestaurants = om.state.home.top_restaurants

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <SmallTitle>Top {om.state.home.current_dish} Restaurants</SmallTitle>
      </View>
      {topRestaurants.length > 0 ? (
        topRestaurants.map((restaurant, index) => {
          return (
            <RestaurantListItem
              key={index}
              restaurant={restaurant}
              rank={index + 1}
            />
          )
        })
      ) : (
        <VStack padding={18}>
          <Text>Loading...</Text>
        </VStack>
      )}
    </ScrollView>
  )
}
