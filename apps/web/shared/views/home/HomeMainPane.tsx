import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'

import * as Animatable from 'react-native-animatable'
import { useOvermind } from '../../state/om'
import HomeRestaurantView from './HomeRestaurantView'
import HomeViewTopDishes from './HomeViewTopDishes'
import HomeSearchResultsView from './HomeSearchResultsView'
import SearchBar from './SearchBar'
import { Spacer } from '../shared/Spacer'
import { VStack, ZStack, StackBaseProps } from '../shared/Stacks'
import { useWindowSize } from '../../hooks/useWindowSize'
import { HomeBreadcrumbs } from './HomeBreadcrumbs'
import { Route } from '../shared/Route'
import { SmallTitle } from '../shared/SmallTitle'
import { HomeStateItem } from '../../state/home'
import _ from 'lodash'

export const drawerBorderRadius = 20

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 20,
    left: 20,
    bottom: 20,
    borderRadius: drawerBorderRadius,
    shadowColor: 'rgba(0,0,0,0.2)',
    shadowRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.3)',
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

function BlurView() {
  return (
    <div
      style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        backdropFilter: 'blur(20px)',
      }}
    />
  )
}

export default function HomeMainPane() {
  const om = useOvermind()
  const drawerWidth = useHomeDrawerWidth()
  const { currentState } = om.state.home

  return (
    <View
      style={[
        styles.container,
        {
          width: drawerWidth,
        },
      ]}
    >
      <ZStack fullscreen borderRadius={drawerBorderRadius} overflow="hidden">
        <BlurView />
      </ZStack>
      <VStack padding={18} paddingBottom={6}>
        <VStack position="absolute" top={22} left={12}>
          <TouchableOpacity
            onPress={() => om.actions.setShowSidebar(om.state.showSidebar)}
            style={styles.button}
          >
            <Image
              source={require('../../assets/menu.png')}
              style={{ width: 22, height: 22, opacity: 0.5 }}
            />
          </TouchableOpacity>
        </VStack>

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

        <SearchBar />
      </VStack>

      <HomeBreadcrumbs />

      <Spacer />

      <VStack height={40} alignItems="center">
        <SmallTitle>
          {currentState.type == 'home' && `Top Dishes`}
          {currentState.type == 'search' &&
            `Top ${currentState.searchQuery} Restaurants`}
        </SmallTitle>
      </VStack>

      <View style={styles.content}>
        <StackView items={om.state.home.breadcrumbStates}>
          {homeState => {
            const item = om.state.router.history.find(
              x => x.id == homeState.historyId
            )
            return (
              <>
                <Route exact name="home" forHistory={item}>
                  <HomeViewTopDishes />
                </Route>
                <Route name="search" forHistory={item}>
                  <HomeSearchResultsView />
                </Route>
                <Route name="restaurant" forHistory={item}>
                  <HomeRestaurantView />
                </Route>
              </>
            )
          }}
        </StackView>
      </View>
    </View>
  )
}

function StackView<A>(props: {
  items: A[]
  children: (a: A, isActive: boolean, index: number) => React.ReactNode
}) {
  const [items, setItems] = useState<A[]>([])
  const isAdding = props.items.length > items.length

  useEffect(() => {
    setTimeout(() => {
      setItems(props.items)
    }, 16)
  }, [props.items, items])

  return (
    <ZStack fullscreen>
      {items.map((item, index) => (
        <Animatable.View
          key={
            JSON.stringify(
              (_.omit((item as any) as HomeStateItem), 'historyId')
            ) + index
          }
          animation="fadeInUp"
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
          }}
        >
          <ZStack
            backgroundColor="white"
            fullscreen
            flex={1}
            zIndex={index}
            top={index * 20}
            shadowColor="rgba(0,0,0,0.15)"
            shadowRadius={7}
            borderRadius={20}
            overflow="hidden"
          >
            {props.children(item, index === items.length - 1, index)}
          </ZStack>
        </Animatable.View>
      ))}
    </ZStack>
  )
}

// function SearchResults() {
//   const om = useOvermind()
//   const searchResults = { results: [], status: '' } //om.state.home.search_results
//   console.log('searchResults', searchResults)

//   return (
//     <View>
//       {!searchResults?.is_results && searchResults.status == 'complete' && (
//         <ContentSection>
//           <Text>Nothing found!</Text>
//         </ContentSection>
//       )}
//       {searchResults.status == 'loading' && (
//         <ContentSection>
//           <Text>Loading...</Text>
//         </ContentSection>
//       )}
//       {searchResults?.results.map((item, index) => (
//         <TouchableOpacity
//           onPress={() => {
//             setTimeout(() => {
//               om.actions.home.clearSearch()
//               om.actions.router.navigate({
//                 name: 'restaurant',
//                 params: { slug: item.slug },
//               })
//             }, 0)
//           }}
//           title={restaurant.name}
//         />
//       ))}
//     </ContentSection>
//   )
// }

// function DishResults(results: string[]) {
//   if (results.length == 0) {
//     return
//   }
//   return (
//     <ContentSection key="dish_results">
//       <SmallTitle>Dishes</SmallTitle>
//       {results.map((dish, index) => (
//         <Result
//           key={index}
//           destination={{
//             name: 'search',
//             params: {
//               query: dish,
//             },
//           }}
//           title={dish}
//         />
//       ))}
//     </ContentSection>
//   )
// }

// function Result({
//   destination,
//   title,
// }: {
//   destination: NavigateItem<any, any>
//   title: string
// }) {
//   const om = useOvermind()
//   return (
//     <TouchableOpacity
//       onPress={() => {
//         setTimeout(() => {
//           om.actions.home.clearSearch()
//           om.actions.router.navigate(destination)
//         }, 0)
//       }}
//       style={{ flex: 1, flexDirection: 'row' }}
//     >
//       <View
//         style={{
//           justifyContent: 'flex-start',
//           flexDirection: 'row',
//           alignItems: 'center',
//           margin: 5,
//           padding: 8,
//           flex: 1,
//         }}
//       >
//         <Text style={{ color: '#555' }}>{title}</Text>
//       </View>
//     </TouchableOpacity>
//   )
// }

// function ContentSection(props: { children: any }) {
//   return (
//     <VStack
//       padding={18}
//       alignItems="center"
//       justifyContent="center"
//       flex={1}
//       {...props}
//     />
//   )
// }

export function Color(props: { of: string }) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: props.of,
      }}
    />
  )
}
