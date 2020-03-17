import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'

import { useOvermind } from '../../state/om'
import Restaurant from './RestaurantView'
import TopDishes from './TopDishes'
import TopRestaurants from './TopRestaurants'
import SearchBar from './SearchBar'
import { Spacer } from '../shared/Spacer'
import { VStack } from '../shared/Stacks'
import { useWindowSize } from '../../hooks/useWindowSize'
import Stack from '../shared/Stack'
import { HomeBreadcrumbs } from './HomeBreadcrumbs'
import { Route } from '../shared/Route'

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
    backgroundColor: 'white',
    zIndex: 10,
  },
  content: {
    flex: 1,
    paddingVertical: 20,
  },
  button: {
    padding: 10,
  },
})

export function useHomeDrawerWidth(): number {
  const [width] = useWindowSize({ throttle: 100 })
  return Math.max(400, width * 0.5)
}

export default function HomeMainPane() {
  const om = useOvermind()
  const searchResults = om.state.home.search_results
  const showSearchResults = !!searchResults
  const drawerWidth = useHomeDrawerWidth()

  return (
    <View
      style={[
        styles.container,
        {
          width: drawerWidth,
        },
      ]}
    >
      <VStack padding={18}>
        <View style={{ position: 'absolute', top: 22, left: 12 }}>
          <TouchableOpacity
            onPress={() => om.actions.setShowSidebar(om.state.showSidebar)}
            style={styles.button}
          >
            <Image
              source={require('../../assets/menu.png')}
              style={{ width: 22, height: 22, opacity: 0.5 }}
            />
          </TouchableOpacity>
        </View>

        <View
          style={{ flexDirection: 'row', width: '100%', paddingBottom: 10 }}
        >
          <Spacer flex />

          <TouchableOpacity
            onPress={() => {
              om.actions.home.setSearchQuery('')
              om.actions.router.navigate(`/`)
            }}
          >
            <Image
              source={require('../../assets/logo.png')}
              style={{ width: 1211 * 0.065, height: 605 * 0.065 }}
            />
          </TouchableOpacity>

          <Spacer flex />
        </View>

        <View>
          <SearchBar />
        </View>
      </VStack>

      <HomeBreadcrumbs />

      <View style={styles.content}>
        {showSearchResults && <SearchResults />}
        {!showSearchResults && (
          <>
            <Route name="home">
              <TopDishes />
            </Route>
            <Route name="restaurant">
              <Restaurant />
            </Route>
            <Route name="search">
              <TopRestaurants />
            </Route>
          </>
        )}
      </View>
    </View>
  )
}

function SearchResults() {
  const om = useOvermind()
  const searchResults = om.state.home.search_results
  console.log('searchResults', searchResults)

  return (
    <View>
      {searchResults?.results.length == 0 &&
        searchResults.status == 'complete' && (
          <ContentSection>
            <Text>Nothing found!</Text>
          </ContentSection>
        )}
      {searchResults.status == 'loading' && (
        <ContentSection>
          <Text>Loading...</Text>
        </ContentSection>
      )}
      {searchResults?.results.map((item, index) => (
        <TouchableOpacity
          onPress={() => {
            setTimeout(() => {
              om.actions.home.clearRestaurantSearch()
              om.actions.router.navigate('/restaurant/' + item.id)
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

function ContentSection(props: { children: any }) {
  return (
    <VStack
      padding={18}
      alignItems="center"
      justifyContent="center"
      flex={1}
      {...props}
    />
  )
}
