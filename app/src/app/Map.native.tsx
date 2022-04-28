import { MAPBOX_ACCESS_TOKEN } from '../constants/constants'
import { hasMovedAtLeast } from '../helpers/mapHelpers'
import { MapProps } from './MapProps'
import { drawerStore } from './drawerStore'
import { setMap } from './getMap'
import { tiles } from './tiles'
import { series, sleep } from '@dish/async'
import { DISH_API_ENDPOINT } from '@dish/graph'
import { useDebounce, useTheme } from '@dish/ui'
import MapboxGL from '@react-native-mapbox-gl/maps'
import { allLightColors } from '@tamagui/theme-base'
import React, { useEffect, useRef, useState } from 'react'
import { StyleSheet, useWindowDimensions } from 'react-native'

MapboxGL.setAccessToken(MAPBOX_ACCESS_TOKEN)
MapboxGL.setTelemetryEnabled(false)

const idFn = (_) => _

export default function Map({
  center,
  span,
  features,
  onMoveEnd,
  onMoveStart,
  onSelect,
  style,
  showUserLocation,
}: MapProps) {
  const height = useWindowDimensions().height
  // const isDrawerAtTop = useStoreInstanceSelector(drawerStore, (x) => x.snapIndexName === 'top')
  const drawerHeight = drawerStore.snapHeights[2]
  const [isLoaded, setIsLoaded] = useState(0)
  const paddingVertical = isLoaded ? drawerHeight / 2 : 0
  const cameraRef = useRef<MapboxGL.Camera>(null)
  const mapRef = useRef<MapboxGL.MapView>(null)
  const onMoveEndDelayed = useDebounce(onMoveEnd ?? idFn, 250)
  const theme = useTheme()

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

  // ensure map loads eventually (if a tile fails etc)
  useEffect(() => {
    setMap(mapRef.current)

    return series([() => sleep(2000), () => setIsLoaded(1)])
  }, [])

  // const pointColor = theme.name === 'dark' ? '#000' : 'rgba(20,30,240,0.5)'

  const vectors = (
    <MapboxGL.VectorSource
      id="regions"
      url={`${DISH_API_ENDPOINT}/tile/public.zcta5,public.hrr,public.nhood_labels,public.zcta5_labels.json`}
    >
      {tiles.map(
        ({
          name,
          minZoom,
          maxZoom,
          activeColor,
          hoverColor,
          color,
          label,
          promoteId,
          labelSource,
        }) => {
          const id = `${name}`.replace('.', '')
          const lineID = `${id}line`
          const fillID = `${id}fill`
          const labelID = `${id}label`
          return (
            <React.Fragment key={id}>
              <MapboxGL.LineLayer
                id={lineID}
                sourceLayerID={name}
                sourceID="regions"
                minZoomLevel={minZoom}
                maxZoomLevel={maxZoom}
                style={{
                  lineCap: 'round',
                  lineColor: ['get', 'color'],
                  // '#000000',
                  // [
                  //   'case',
                  //   ['==', ['feature-state', 'active'], true],
                  //   lineColorActive || '',
                  //   ['==', ['feature-state', 'hover'], true],
                  //   lineColorHover || '',
                  //   ['==', ['feature-state', 'active'], null],
                  //   lineColor,
                  //   'green',
                  // ],
                  lineOpacity: 1,
                  lineWidth: 3,
                }}
              />
              <MapboxGL.FillLayer
                id={fillID}
                sourceLayerID={name}
                sourceID="regions"
                minZoomLevel={minZoom}
                maxZoomLevel={maxZoom}
                style={{
                  fillColor: ['case', ['has', 'color'], ['get', 'color'], 'rgba(100,200,100,0.4)'],

                  // [
                  //   'case',
                  //   ['==', ['feature-state', 'active'], true],
                  //   activeColor,
                  //   ['==', ['feature-state', 'hover'], true],
                  //   hoverColor,
                  //   ['==', ['feature-state', 'active'], false],
                  //   color,
                  //   'rgba(255,255,0,0.1)',
                  // ],
                  fillAntialias: true,
                  fillOpacity: 0.25,
                }}
              />
              {labelSource && (
                <MapboxGL.SymbolLayer
                  id={labelID}
                  sourceLayerID={labelSource}
                  sourceID="regions"
                  minZoomLevel={minZoom}
                  maxZoomLevel={maxZoom}
                  style={{
                    textField: `{${label}}`,
                    textFont: ['PT Serif Bold', 'Arial Unicode MS Bold'],
                    // textAllowOverlap: true,
                    textVariableAnchor: ['center', 'center'],
                    textRadialOffset: 10,
                    // 'iconallowOverlap: true,
                    textSize: 14,
                    // , {
                    //   base: 1,
                    //   stops: [
                    //     [10, 6],
                    //     [16, 22],
                    //   ],
                    // },
                    textJustify: 'center',
                    symbolPlacement: 'point',
                    textColor: theme.color.toString(),
                    // getting typescript err here
                    // [
                    //   'case',
                    //   ['==', ['feature-state', 'active'], true],
                    //   theme.color,
                    //   ['==', ['feature-state', 'hover'], true],
                    //   green,
                    //   ['==', ['feature-state', 'active'], null],
                    //   theme.colorHover,
                    //   'green',
                    // ],
                    textHaloColor: 'rgba(255,255,255,1)',
                    textHaloWidth: 1,
                  }}
                />
              )}
            </React.Fragment>
          )
        }
      )}
    </MapboxGL.VectorSource>
  )

  return (
    <MapboxGL.MapView
      style={[styles.map /* isDrawerAtTop ? { opacity: 0 } : null */]}
      ref={mapRef}
      // styleURL={style}
      onDidFinishLoadingMap={() => {
        setIsLoaded(1)
      }}
      onDidFailLoadingMap={() => {
        console.warn('FAIL LOADING MAP!!!!!!!')
        setIsLoaded(1)
      }}
      onTouchStart={onMoveStart}
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
      {showUserLocation && <MapboxGL.UserLocation animated renderMode="native" />}
      {/* // Causes error on Android: // Error while updating property 'stop' of a  view managed by: RCTMGLCamera*/}
      <MapboxGL.Camera
        ref={cameraRef}
        minZoomLevel={2}
        maxZoomLevel={22}
        defaultSettings={{
          zoomLevel: span.lng * 200,
          bounds,
        }}
      />

      {vectors}

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
        {/* <MapboxGL.SymbolLayer
          id="pointCount"
          style={{
            textField: ['case', ['has', 'point_count'], '{point_count}', ['get', 'rank']],
            textSize: 12,
            textColor: theme.color.toString(),
            textAllowOverlap: true,
            iconAllowOverlap: true,
          }}
        /> */}
        {/* <MapboxGL.SymbolLayer
          id="pointLabel"
          filter={['!', ['has', 'point_count']]}
          style={{
            textField: ['format', ['get', 'title']],
            textSize: 12,
            textFont: ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
            textColor: theme.color.toString(),
            // doesnt support interpolate for now
            textOffset: [0, 1.25],
            textAnchor: 'top',
            textAllowOverlap: false,
          }}
        /> */}
        <MapboxGL.CircleLayer
          id="circlePointsLayer"
          filter={['!', ['has', 'point_count']]}
          style={{
            circleColor: [
              'match',
              ['get', 'selected'],
              1,
              'rgba(255,255,255,1)',
              0,
              allLightColors.purple10,
              allLightColors.purple10,
            ],
            circleRadius: ['interpolate', ['exponential', 1.5], ['zoom'], 9, 4, 11, 8, 16, 22],
          }}
        />
      </MapboxGL.ShapeSource>
    </MapboxGL.MapView>
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
