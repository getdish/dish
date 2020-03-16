import React, { useState } from 'react'
import { Switch, Route } from 'react-router-dom'
import { useHistory } from 'react-router-dom'
import {
  View,
  Button,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native'
import SlidingUpPanel, { Animated } from 'rn-sliding-up-panel'

import { useOvermind } from '../../state/om'
import Restaurant from './Restaurant'
import TopDishes from './TopDishes'
import TopRestaurants from './TopRestaurants'
import SearchBar from './SearchBar'

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 20,
    left: 20,
    bottom: 20,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: 'rgba(0,0,0,0.2)',
    shadowRadius: 20,
    padding: 18,
    backgroundColor: 'white',
    width: '50%',
    minWidth: 400,
  },
  content: {
    flex: 1,
    paddingVertical: 20,
  },
  close: {
    width: 100,
    alignSelf: 'flex-end',
    margin: 3,
  },
  button: {
    padding: 10,
  },
})

export let bottomPanel: SlidingUpPanel | null = null

export default function MainPane() {
  const om = useOvermind()
  const searchResults = om.state.home.search_results
  const showSearchResults = !!searchResults

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', width: '100%' }}>
        <TouchableOpacity
          onPress={() => om.actions.setShowSidebar(om.state.showSidebar)}
          style={styles.button}
        >
          <Image
            source={require('../../assets/menu.png')}
            style={{ width: 28, height: 28 }}
          />
        </TouchableOpacity>

        <View style={{ width: 12 }} />

        <SearchBar />
      </View>

      <View style={styles.content}>
        {showSearchResults && <SearchResults />}

        {!showSearchResults && (
          <Switch>
            <Route exact path="/">
              <TopDishes />
            </Route>
            <Route path="/e/:slug">
              <Restaurant />
            </Route>
            <Route path="/best/:dish">
              <TopRestaurants />
            </Route>
          </Switch>
        )}
      </View>
    </View>
  )
}

function SearchResults() {
  const om = useOvermind()
  const history = useHistory()
  const searchResults = om.state.home.search_results
  console.log('searchResults', searchResults)

  return (
    <View>
      {searchResults?.results.length == 0 &&
        searchResults.status == 'complete' && <Text>Nothing found!</Text>}
      {searchResults.status == 'loading' && <Text>Loading...</Text>}
      {searchResults?.results.map((item, index) => (
        <TouchableOpacity
          onPress={() => {
            setTimeout(() => {
              om.actions.home.clearRestaurantSearch()
              history.push('/e/' + item.id)
            }, 0)
          }}
          style={{ flex: 1, flexDirection: 'row' }}
        >
          <View
            key={index}
            style={{
              justifyContent: 'flex-start',
              flexDirection: 'row',
              alignItems: 'center',
              margin: 5,
              padding: 8,
              flex: 1,
            }}
          >
            <Text style={{ color: '#555' }}>{item.name}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  )
}
