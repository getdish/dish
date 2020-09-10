import { VStack } from '@dish/ui'
import MapboxGL from '@react-native-mapbox-gl/maps'
import React from 'react'
import { Dimensions, StyleSheet, View } from 'react-native'

import { MAPBOX_ACCESS_TOKEN } from '../constants'

MapboxGL.setAccessToken(MAPBOX_ACCESS_TOKEN)
MapboxGL.setTelemetryEnabled(false)

export function MapNative() {
  const { width, height } = Dimensions.get('screen')
  return (
    <VStack width={width} height={height}>
      <MapboxGL.MapView style={styles.map} />
    </VStack>
  )
}

const styles = StyleSheet.create({
  container: {
    height: 300,
    width: 300,
    backgroundColor: 'tomato',
  },
  map: {
    flex: 1,
  },
})
