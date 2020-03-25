import React, { useEffect, useMemo } from 'react'
import { StyleSheet, Text, View, ScrollView } from 'react-native'

import { useOvermind } from '../../state/om'
import { RestaurantListItem } from './RestaurantListItem'
import { SmallTitle } from '../shared/SmallTitle'
import { VStack } from '../shared/Stacks'
import { HomeStateItemSearch, HomeStateItem } from '../../state/home'
import { memoizeWeak } from '../../helpers/memoizeWeak'
import { closeAllPopovers, popoverCloseCbs } from '../shared/Popover'
import HomeLenseBar from './HomeLenseBar'

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

const weakKey = memoizeWeak(() => `${Math.random()}`)

export default function HomeSearchResultsView({
  state,
}: {
  state: HomeStateItemSearch
}) {
  return (
    <VStack flex={1}>
      <SmallTitle>Top {state.searchQuery} Restaurants</SmallTitle>
      <VStack position="relative" flex={1}>
        <HomeLenseBar backgroundGradient />
        <HomeSearchResultsViewContent state={state} />
      </VStack>
    </VStack>
  )
}

function HomeSearchResultsViewContent({
  state,
}: {
  state: HomeStateItemSearch
}) {
  const om = useOvermind()
  const { results } = state

  const contents = useMemo(() => {
    if (results && results.status == 'complete') {
      return results.results.restaurants?.map((restaurant, index) => {
        return (
          <RestaurantListItem
            key={index}
            restaurant={restaurant as any}
            rank={index + 1}
            onHover={() => {
              om.actions.home.setHoveredRestaurant({ ...restaurant } as any)
            }}
          />
        )
      })
    }

    if (results?.status == 'loading') {
      return (
        <VStack padding={18}>
          <Text>Loading...</Text>
        </VStack>
      )
    }
  }, [
    results?.status,
    results?.['results']?.restaurants.map((x) => x.id).join(''),
  ])

  return (
    <ScrollView
      onScroll={() => {
        if (popoverCloseCbs.size) {
          closeAllPopovers()
        }
      }}
    >
      <VStack paddingVertical={20} paddingTop={20 + 40}>
        {contents}
      </VStack>
    </ScrollView>
  )
}
