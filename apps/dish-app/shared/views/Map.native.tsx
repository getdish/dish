import { VStack } from '@dish/ui'
import MapboxGL from '@react-native-mapbox-gl/maps'
import React from 'react'
import { Dimensions, StyleSheet, View } from 'react-native'

import { MAPBOX_ACCESS_TOKEN } from '../constants'
import { MapProps } from './MapProps'

MapboxGL.setAccessToken(MAPBOX_ACCESS_TOKEN)
MapboxGL.setTelemetryEnabled(false)

export const Map = (props: MapProps) => {
  const { width, height } = Dimensions.get('screen')
  return (
    <VStack width={width} height={height}>
      <MapboxGL.MapView
        style={styles.map}
        styleURL="mapbox://styles/nwienert/ckddrrcg14e4y1ipj0l4kf1xy"
      />
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
