import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

import { HomeStateItem } from '../../state/home'
import { useOvermind } from '../../state/om'
import { NavigateItem } from '../../state/router'
import { HStack } from '../shared/Stacks'

export function HomeBreadcrumbs() {
  const om = useOvermind()
  let parents = om.state.home.breadcrumbStates

  if (parents.length == 1) {
    parents = []
  }

  return (
    <HStack padding={0} alignItems="center" justifyContent="center" height={20}>
      {parents.map((x, i) => (
        <HStack alignItems="center" justifyContent="center" key={i}>
          <HomeBreadcrumb
            homeState={x as any}
            isLast={i === parents.length - 1}
          />
          {i < parents.length - 1 && (
            <Text style={{ paddingHorizontal: 10, opacity: 0.3, fontSize: 9 }}>
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
  // TODO we can redo this similar to HomeStackView and refacotr into an action
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

  let titleElement = <Text style={{ fontSize: 12 }}>{title}</Text>

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
