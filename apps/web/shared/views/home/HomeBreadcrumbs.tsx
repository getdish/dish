import React from 'react'
import { useOvermind } from '../../state/om'
import { Text, View, TouchableOpacity } from 'react-native'
import { HStack } from '../shared/Stacks'

export function HomeBreadcrumbs() {
  const om = useOvermind()
  let parents = om.state.home.breadcrumbStates

  if (parents[0].type != 'home') {
    parents = [{ type: 'home', searchQuery: '', centre: null }, ...parents]
  }

  return (
    <HStack padding={10}>
      {parents.map((x, i) => (
        <HStack key={i}>
          <TouchableOpacity
            onPress={() => {
              // todo
            }}
          >
            <Text>{x.type}</Text>
          </TouchableOpacity>
          {i < parents.length - 1 && (
            <Text style={{ paddingHorizontal: 10 }}>➡</Text>
          )}
        </HStack>
      ))}
    </HStack>
  )
}
