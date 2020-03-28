import React, { useMemo, useLayoutEffect } from 'react'
import { Text, ScrollView, FlatList } from 'react-native'

import { useOvermind } from '../../state/om'
import { RestaurantListItem } from './RestaurantListItem'
import { Title } from '../shared/SmallTitle'
import { VStack } from '../shared/Stacks'
import { HomeStateItemSearch } from '../../state/home'
import { closeAllPopovers, popoverCloseCbs } from '../shared/Popover'
import HomeLenseBar from './HomeLenseBar'
import { memoIsEqualDeep } from '../../helpers/memoIsEqualDeep'

export default memoIsEqualDeep(function HomeSearchResultsView({
  state,
}: {
  state: HomeStateItemSearch
}) {
  return (
    <VStack flex={1}>
      <Title>Top {state.searchQuery} Restaurants</Title>
      <VStack position="relative" flex={1}>
        <HomeLenseBar backgroundGradient />
        <HomeSearchResultsViewContent state={state} />
      </VStack>
    </VStack>
  )
})

function HomeSearchResultsViewContent({
  state,
}: {
  state: HomeStateItemSearch
}) {
  const om = useOvermind()
  const allRestaurants = om.state.home.restaurants
  const resultsIds =
    ((state.results?.status == 'complete' &&
      state.results?.results?.restaurantIds) ||
      undefined) ??
    []
  console.log('results', resultsIds)
  const results = resultsIds.map((id) => allRestaurants[id])

  // const contents = useMemo(() => {
  //   if (results && results.status == 'complete') {
  //     return results.results.restaurantIds?.map((id, index) => {
  //       return (
  //         <RestaurantListItem
  //           key={index}
  //           restaurant={allRestaurants[id]}
  //           rank={index + 1}
  //           onHover={() => {
  //             om.actions.home.setHoveredRestaurant(allRestaurants[id])
  //           }}
  //         />
  //       )
  //     })
  //   }

  //   if (state.results?.status == 'loading') {
  //     return (
  //       <VStack padding={18}>
  //         <Text>Loading...</Text>
  //       </VStack>
  //     )
  //   }
  // }, [resultsKey])

  return (
    <FlatList
      disableVirtualization={false}
      data={results}
      renderItem={({ item, index }) => {
        return (
          <RestaurantListItem
            key={item.id}
            restaurant={item}
            rank={index + 1}
            onHover={() => {
              om.actions.home.setHoveredRestaurant(item)
            }}
          />
        )
      }}
    />
  )

  // return (
  //   <ScrollView
  //     onScroll={() => {
  //       if (popoverCloseCbs.size) {
  //         closeAllPopovers()
  //       }
  //     }}
  //   >
  //     <VStack paddingVertical={20} paddingTop={20 + 70}>
  //       {contents}
  //     </VStack>
  //   </ScrollView>
  // )
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
