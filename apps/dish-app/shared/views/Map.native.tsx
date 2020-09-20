import { useStore } from '@dish/use-store'
import MapboxGL from '@react-native-mapbox-gl/maps'
import React, { useEffect, useRef, useState } from 'react'
import { Animated, Dimensions, StyleSheet } from 'react-native'

import { BottomDrawerStore } from '../BottomDrawerStore'
import { MAPBOX_ACCESS_TOKEN } from '../constants'
import { hasMovedAtLeast } from './hasMovedAtLeast'
import { MapProps } from './MapProps'

MapboxGL.setAccessToken(MAPBOX_ACCESS_TOKEN)
MapboxGL.setTelemetryEnabled(false)

export const Map = ({ center, span, features, onMoveEnd }: MapProps) => {
  const { width, height } = Dimensions.get('screen')
  const drawerStore = useStore(BottomDrawerStore)
  const drawerHeight = drawerStore.currentHeight
  const [isLoaded, setIsLoaded] = useState(false)
  const paddingVertical = isLoaded ? drawerHeight / 2 : 0
  const ty = -paddingVertical
  const tyRef = useRef(new Animated.Value(ty))

  useEffect(() => {
    const spring = Animated.spring(tyRef.current, {
      useNativeDriver: true,
      toValue: ty,
    })
    spring.start()
  }, [ty])

  const bounds = {
    ne: [center.lng - span.lng, center.lat - span.lat],
    sw: [center.lng + span.lng, center.lat + span.lat],
    paddingTop: paddingVertical,
    paddingBottom: paddingVertical,
  }
  const cameraRef = useRef<MapboxGL.Camera>()
  const mapRef = useRef<MapboxGL.MapView>()

  useEffect(() => {
    const { ne, sw, paddingTop, paddingBottom } = bounds
    cameraRef.current?.fitBounds(ne, sw, [paddingTop, 0, paddingBottom, 0], 500)
  }, [JSON.stringify(bounds)])

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
        ref={mapRef}
        styleURL="mapbox://styles/nwienert/ckddrrcg14e4y1ipj0l4kf1xy"
        onDidFinishLoadingMap={() => {
          setIsLoaded(true)
        }}
        onRegionDidChange={async (event) => {
          const map = mapRef.current
          if (!map) return
          const [clng, clat] = await map.getCenter()
          const [ne, sw] = await map.getVisibleBounds()
          const padPct = paddingVertical / (height / 2)
          const spanLatUnpadded = ne[1] - clat
          const spanPct = spanLatUnpadded * padPct
          const spanLat = spanLatUnpadded - spanPct
          const next = {
            center: {
              lng: clng,
              lat: clat,
            },
            span: {
              lng: clng - sw[0],
              lat: spanLat,
            },
          }
          if (hasMovedAtLeast(next, { center, span })) {
            onMoveEnd?.(next)
          }
        }}
      >
        <MapboxGL.Camera
          ref={cameraRef}
          minZoomLevel={2}
          maxZoomLevel={14}
          defaultSettings={{
            zoomLevel: span.lng * 200,
            bounds,
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
