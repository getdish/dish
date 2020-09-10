import MapboxGL from '@react-native-mapbox-gl/maps'
import React from 'react'
import { StyleSheet, View } from 'react-native'

import { MAPBOX_ACCESS_TOKEN } from '../constants'

MapboxGL.setAccessToken(MAPBOX_ACCESS_TOKEN)
MapboxGL.setTelemetryEnabled(false)

export function MapNative() {
  return (
    <View style={styles.container}>
      <MapboxGL.MapView style={styles.map} />
    </View>
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
