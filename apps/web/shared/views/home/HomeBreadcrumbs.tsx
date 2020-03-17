import React from 'react'
import { useOvermind } from '../../state/om'
import { Text } from 'react-native'

export function HomeBreadcrumbs() {
  const om = useOvermind()

  return (
    <>
      <Text>{JSON.stringify(om.state.home.history)}</Text>
    </>
  )
}
