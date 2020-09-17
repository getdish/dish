import { useStore } from '@dish/use-store'
import MapboxGL from '@react-native-mapbox-gl/maps'
import React, { useEffect, useRef } from 'react'
import { Animated, Dimensions, StyleSheet } from 'react-native'

import { BottomDrawerStore } from '../BottomDrawerStore'
import { MAPBOX_ACCESS_TOKEN } from '../constants'
import { MapProps } from './MapProps'

MapboxGL.setAccessToken(MAPBOX_ACCESS_TOKEN)
MapboxGL.setTelemetryEnabled(false)

export const Map = ({ center, span, features }: MapProps) => {
  const { width, height } = Dimensions.get('screen')
  const drawerStore = useStore(BottomDrawerStore)
  const drawerHeight = drawerStore.currentHeight
  const paddingVertical = drawerHeight / 2
  const ty = -paddingVertical
  const tyRef = useRef(new Animated.Value(ty))

  useEffect(() => {
    const spring = Animated.spring(tyRef.current, {
      useNativeDriver: true,
      toValue: ty,
    })
    spring.start()
  }, [ty])

  return (
    <Animated.View
      style={{
        width,
        height,
        transform: [{ translateY: tyRef.current }],
      }}
    >
      <MapboxGL.MapView
        style={styles.map}
        styleURL="mapbox://styles/nwienert/ckddrrcg14e4y1ipj0l4kf1xy"
      >
        <MapboxGL.Camera
          // centerCoordinate={[]}
          zoomLevel={span.lng * 100}
          minZoomLevel={0}
          maxZoomLevel={14}
          bounds={{
            ne: [center.lng - span.lng, center.lat - span.lat],
            sw: [center.lng + span.lng, center.lat + span.lat],
            paddingTop: paddingVertical,
            paddingBottom: paddingVertical,
          }}
        />
        <MapboxGL.ShapeSource
          id="trackClustersSource"
          shape={{
            type: 'FeatureCollection',
            features,
          }}
          cluster
          clusterRadius={10}
        >
          <MapboxGL.SymbolLayer
            id="pointCount"
            style={{
              textColor: '#000',
            }}
          />
          <MapboxGL.CircleLayer
            id="circleClustersLayer"
            belowLayerID="pointCount"
            filter={['has', 'point_count']}
            style={{
              circleColor: 'red',
            }}
          />
        </MapboxGL.ShapeSource>
      </MapboxGL.MapView>
    </Animated.View>
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
