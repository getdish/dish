import React from 'react'
import { useOvermind } from '../../state/om'
import { Text, View, TouchableOpacity } from 'react-native'
import { HStack } from '../shared/Stacks'
import { HomeStateItem } from '../../state/home'
import { NavigateItem } from '../../state/router'

export function HomeBreadcrumbs() {
  const om = useOvermind()
  let parents = om.state.home.breadcrumbStates

  if (parents[0].type != 'home') {
    parents = [{ type: 'home', searchQuery: '', centre: null }, ...parents]
  }

  if (parents.length == 1) {
    parents = []
  }

  return (
    <HStack padding={0} alignItems="center" justifyContent="center" height={25}>
      {parents.map((x, i) => (
        <HStack alignItems="center" justifyContent="center" key={i}>
          <HomeBreadcrumb homeState={x} isLast={i === parents.length - 1} />
          {i < parents.length - 1 && (
            <Text style={{ paddingHorizontal: 10, opacity: 0.3, fontSize: 10 }}>
              ▶
            </Text>
          )}
        </HStack>
      ))}
    </HStack>
  )
}

function HomeBreadcrumb({
  homeState,
  isLast,
}: {
  homeState: HomeStateItem
  isLast: boolean
}) {
  const om = useOvermind()
  let title = ''
  let navTo: NavigateItem

  switch (homeState.type) {
    case 'home':
      title = `Home`
      navTo = { name: 'home' }
      break
    case 'search':
      title = `"${homeState.searchQuery}"`
      navTo = { name: 'search', params: { query: homeState.searchQuery } }
      break
    case 'restaurant':
      title = homeState.restaurant?.name ?? ''
      navTo = {
        name: 'restaurant',
        params: { slug: homeState.restaurant?.slug },
      }
      break
  }

  let titleElement = <Text>{title}</Text>

  if (isLast) {
    return titleElement
  }

  return (
    <View style={{ opacity: 0.5 }}>
      <TouchableOpacity
        onPress={() => {
          om.actions.router.navigate(navTo)
        }}
      >
        {titleElement}
      </TouchableOpacity>
    </View>
  )
}
