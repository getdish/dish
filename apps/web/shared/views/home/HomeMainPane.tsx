import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'

import { useOvermind } from '../../state/om'
import HomeRestaurantView from './HomeRestaurantView'
import TopDishes from './TopDishes'
import HomeSearchResultsView from './HomeSearchResultsView'
import SearchBar from './SearchBar'
import { Spacer } from '../shared/Spacer'
import { VStack, ZStack, StackBaseProps } from '../shared/Stacks'
import { useWindowSize } from '../../hooks/useWindowSize'
import { HomeBreadcrumbs } from './HomeBreadcrumbs'
import { Route } from '../shared/Route'
import { Restaurant } from '@dish/models'
import { NavigateItem } from '../../state/router'
import { SmallTitle } from '../shared/SmallTitle'

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
  return Math.min(Math.max(400, width * 0.5), 600)
}

export default function HomeMainPane() {
  const om = useOvermind()
  const searchResults = om.state.home.search_results
  const showSearchResults =
    searchResults.status == 'loading' || searchResults.is_results

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
              om.actions.router.navigate({ name: 'home' })
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
            <Route exact name="home">
              <TopDishes />
            </Route>
            <Route name="restaurant">
              <HomeRestaurantView />
            </Route>
            <Route name="search">
              <HomeSearchResultsView />
            </Route>
          </>
        )}
      </View>
    </View>
  )
}

function StackView<A>(props: {
  items: A[]
  children: (a: A, isActive: boolean, index: number) => React.ReactNode
}) {
  const [state, setState] = useState<{ items: A[] }>({
    items: [],
  })

  useEffect(() => {
    const forward = props.items.length > state.items.length
    setState({ items: props.items })
  }, [props.items, state.items])

  return (
    <ZStack fullscreen>
      {state.items.map((item, index) => (
        <ZStack
          backgroundColor="white"
          fullscreen
          key={index}
          flex={1}
          zIndex={index}
        >
          {props.children(item, index === state.items.length - 1, index)}
        </ZStack>
      ))}
    </ZStack>
  )
}

function SearchResults() {
  const om = useOvermind()
  const searchResults = om.state.home.search_results
  return (
    <View>
      {!searchResults?.is_results && searchResults.status == 'complete' && (
        <ContentSection>
          <Text>Nothing found!</Text>
        </ContentSection>
      )}
      {searchResults.status == 'loading' && (
        <ContentSection>
          <Text>Loading...</Text>
        </ContentSection>
      )}
      {Object.keys(searchResults.results).map(key => {
        const section = searchResults.results[key]
        switch (key) {
          case 'restaurants':
            return RestaurantResults(section)
          case 'dishes':
            return DishResults(section)
        }
      })}
    </View>
  )
}

function RestaurantResults(results: Partial<Restaurant>[]) {
  if (results.length == 0) {
    return
  }
  return (
    <ContentSection key="restaurant_results">
      <SmallTitle>Restaurants</SmallTitle>
      {results.map((restaurant, index) => (
        <Result
          key={index}
          destination={{
            name: 'restaurant',
            params: {
              slug: restaurant.slug,
            },
          }}
          title={restaurant.name}
        />
      ))}
    </ContentSection>
  )
}

function DishResults(results: string[]) {
  if (results.length == 0) {
    return
  }
  return (
    <ContentSection key="dish_results">
      <SmallTitle>Dishes</SmallTitle>
      {results.map((dish, index) => (
        <Result
          key={index}
          destination={{
            name: 'search',
            params: {
              query: dish,
            },
          }}
          title={dish}
        />
      ))}
    </ContentSection>
  )
}

function Result({
  destination,
  title,
}: {
  destination: NavigateItem<any, any>
  title: string
}) {
  const om = useOvermind()
  return (
    <TouchableOpacity
      onPress={() => {
        setTimeout(() => {
          om.actions.home.clearSearch()
          om.actions.router.navigate(destination)
        }, 0)
      }}
      style={{ flex: 1, flexDirection: 'row' }}
    >
      <View
        style={{
          justifyContent: 'flex-start',
          flexDirection: 'row',
          alignItems: 'center',
          margin: 5,
          padding: 8,
          flex: 1,
        }}
      >
        <Text style={{ color: '#555' }}>{title}</Text>
      </View>
    </TouchableOpacity>
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
