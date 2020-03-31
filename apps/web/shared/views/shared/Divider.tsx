import React from 'react'
import { View } from 'react-native'

import { Spacer } from './Spacer'
import { HStack } from './Stacks'

export const Divider = (props: { flex?: boolean; vertical?: boolean }) => {
  return (
    <HStack
      flexDirection={props.vertical ? 'column' : 'row'}
      flex={props.flex === true ? 1 : 0}
      width={props.vertical ? 1 : props.flex == true ? 'auto' : '100%'}
      height={!props.vertical ? 1 : props.flex == true ? 'auto' : '100%'}
    >
      <View style={{ flex: 1 }} />
      <View
        style={{ height: 1, flex: 10, backgroundColor: '#000', opacity: 0.05 }}
      />
      <View style={{ flex: 1 }} />
    </HStack>
  )
}
