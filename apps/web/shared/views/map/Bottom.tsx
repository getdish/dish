import React, { useState } from 'react'
import { View, Button, Text } from 'react-native'
import SlidingUpPanel, { Animated } from 'rn-sliding-up-panel'

import { useOvermind } from '../../state/om'
import Restaurant from './Restaurant'

const styles = {
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    backgroundColor: 'white',
  },
  close: {
    width: 100,
    alignSelf: 'flex-end',
    margin: 3,
  },
}

export default function Bottom() {
  const { state, actions } = useOvermind()

  return (
    <View style={styles.container}>
      <SlidingUpPanel ref={c => actions.map.setPanel(c)} friction={0.12}>
        <View style={styles.content}>
          <View style={styles.close}>
            <Button title="Hide" onPress={() => state.map.panel.hide()} />
          </View>
          <Restaurant />
        </View>
      </SlidingUpPanel>
    </View>
  )
}
