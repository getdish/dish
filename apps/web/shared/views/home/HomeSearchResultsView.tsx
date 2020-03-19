import React, { useEffect } from 'react'
import { StyleSheet, Text, View, ScrollView } from 'react-native'

import { useOvermind } from '../../state/om'
import { RestaurantListItem } from './RestaurantListItem'
import { SmallTitle } from '../shared/SmallTitle'
import { VStack } from '../shared/Stacks'
import { HomeStateItemSearch } from '../../state/home'

export default function HomeSearchResultsView() {
  const om = useOvermind()
  const state = om.state.home.currentState as HomeStateItemSearch

  if (state.type != 'search') {
    return null
  }

  return <HomeSearchResultsViewContent state={state} />
}

function HomeSearchResultsViewContent({
  state,
}: {
  state: HomeStateItemSearch
}) {
  const om = useOvermind()
  const query = `${om.state.router.curPage.params.query}`
  const { results } = state

  return (
    <ScrollView>
      <VStack paddingVertical={20}>
        {results &&
          results.status == 'complete' &&
          results.results.restaurants?.map((restaurant, index) => {
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
          })}
        {results?.status == 'loading' && (
          <VStack padding={18}>
            <Text>Loading...</Text>
          </VStack>
        )}
      </VStack>
    </ScrollView>
  )
}
