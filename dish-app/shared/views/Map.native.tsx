import { useStore } from '@dish/use-store'
import MapboxGL from '@react-native-mapbox-gl/maps'
import React, { useEffect, useRef, useState } from 'react'
import { Animated, Dimensions, StyleSheet } from 'react-native'
import { useDebounce } from 'snackui'

import { BottomDrawerStore } from '../BottomDrawerStore'
import { MAPBOX_ACCESS_TOKEN } from '../constants'
import { hasMovedAtLeast } from './hasMovedAtLeast'
import { MapProps } from './MapProps'

MapboxGL.setAccessToken(MAPBOX_ACCESS_TOKEN)
MapboxGL.setTelemetryEnabled(false)

const idFn = (_) => _

export const MapView = ({
  center,
  span,
  features,
  onMoveEnd,
  onSelect,
}: MapProps) => {
  const { width, height } = Dimensions.get('screen')
  const drawerStore = useStore(BottomDrawerStore)
  const drawerHeight = drawerStore.currentHeight
  const [isLoaded, setIsLoaded] = useState(0)
  const paddingVertical = isLoaded ? drawerHeight / 2 : 0
  const ty = -paddingVertical
  const tyRef = useRef(new Animated.Value(ty))
  const cameraRef = useRef<MapboxGL.Camera>(null)
  const mapRef = useRef<MapboxGL.MapView>(null)
  const onMoveEndDelayed = useDebounce(onMoveEnd ?? idFn, 250)

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
          setIsLoaded(1)
        }}
        onPress={async (e) => {
          console.log('pressing', e)
          const map = mapRef.current
          if (!map) return
          if (!('coordinates' in e.geometry)) return
          const point = await map?.getPointInView(e.geometry.coordinates as any)
          if (!point) return
          const features = await map.queryRenderedFeaturesAtPoint(point)
          if (!features || !features.features?.length) return
          console.log('features', point, features)
          if (features.features.length === 1) {
            onSelect?.(features.features[0]!.properties?.id)
            // single point
          } else {
            onSelect?.(features.features[0]!.properties?.id)
            // multi-point
          }
        }}
        onRegionDidChange={async (event) => {
          // ignore initial load
          if (isLoaded === 1) {
            setIsLoaded(2)
            return
          }
          if (isLoaded < 2) return
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
            onMoveEndDelayed?.(next)
          }
        }}
      >
        {/* // Causes error on Android: // Error while updating property 'stop' of a  view managed by: RCTMGLCamera*/}
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
          clusterRadius={4}
          clusterMaxZoomLevel={2}
        >
          <MapboxGL.CircleLayer
            id="circleClustersLayer"
            belowLayerID="pointCount"
            filter={['has', 'point_count']}
            style={{
              circleColor: 'rgba(150,10,40,0.5)',
              circleRadius: 15,
            }}
          />
          <MapboxGL.SymbolLayer
            id="pointCount"
            style={{
              textField: [
                'case',
                ['has', 'point_count'],
                '{point_count}',
                ['get', 'rank'],
              ],
              textSize: 12,
              textColor: '#000',
              textAllowOverlap: true,
              iconAllowOverlap: true,
            }}
          />
          <MapboxGL.SymbolLayer
            id="pointLabel"
            filter={['!', ['has', 'point_count']]}
            style={{
              textField: ['format', ['get', 'title']],
              textSize: 12,
              textFont: ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
              textColor: '#000',
              // doesnt support interpolate for now
              textOffset: [0, 1.25],
              textAnchor: 'top',
              textAllowOverlap: false,
            }}
          />
          <MapboxGL.CircleLayer
            id="circlePointsLayer"
            layerIndex={200}
            filter={['!', ['has', 'point_count']]}
            style={{
              circleColor: [
                'match',
                ['get', 'selected'],
                1,
                'rgba(60,80,255,1)',
                0,
                'rgba(20,30,240,0.5)',
                'rgba(20,30,240,0.5)',
              ],
              circleRadius: [
                'interpolate',
                ['exponential', 1.5],
                ['zoom'],
                9,
                4,
                11,
                8,
                16,
                22,
              ],
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
