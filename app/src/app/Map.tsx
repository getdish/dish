import { MAPBOX_ACCESS_TOKEN, isM1Sim } from '../constants/constants'
import * as mapHelpers from '../helpers/mapHelpers'
import { hasMovedAtLeast, mapPositionToBBox } from '../helpers/mapHelpers'
import { hexToRGB } from '../helpers/rgb'
import { useIsMountedRef } from '../helpers/useIsMountedRef'
import { MapRegionEvent } from '../types/homeTypes'
import { MapProps } from './MapProps'
import { setMap as setMapGlobal } from './getMap'
import { getInitialRegionSlug } from './initialRegionSlug'
import { tiles } from './tiles'
import { fullyIdle, series, sleep } from '@dish/async'
import { TILES_HOST, slugify } from '@dish/graph'
import { supportsTouchWeb } from '@dish/helpers'
import { useGet, useThemeName } from '@dish/ui'
import { lightColors } from '@tamagui/theme-base'
import bbox from '@turf/bbox'
import union from '@turf/union'
import _, { capitalize, debounce, isEqual, throttle } from 'lodash'
import mapboxgl, { MapboxGeoJSONFeature } from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import React, { useEffect, useRef, useState } from 'react'
import { Dimensions } from 'react-native'

mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN

const RESTAURANTS_SOURCE_ID = 'RESTAURANTS_SOURCE_ID'
const RESTAURANTS_UNCLUSTERED_SOURCE_ID = 'RESTAURANTS_UNCLUSTERED_SOURCE_ID'
const RESTAURANT_RANK_LABEL_ID = 'RESTAURANT_RANK_LABEL_ID'
const UNCLUSTERED_LABEL_LAYER_ID = 'UNCLUSTERED_LABEL_LAYER_ID'
const CLUSTER_LABEL_LAYER_ID = 'CLUSTER_LABEL_LAYER_ID'
const POINT_LAYER_ID = 'POINT_LAYER_ID'

const round = (val: number, dec = 1000000) => {
  return Math.round(val * dec) / dec
}

type MapInternalState = {
  active: null | number
  hasSetInitialSource: boolean
  currentMoveCancel: Function | null
  preventMoveEnd: boolean
}

// this is a singleton view anyway
const internal: MapInternalState = {
  active: null as null | number,
  hasSetInitialSource: false,
  currentMoveCancel: null as Function | null,
  preventMoveEnd: false,
}

let curRegion: MapRegionEvent | null = null
let curRegionId

const clearTileActive = (map: mapboxgl.Map) => {
  curRegionId && setTileActive(map, curRegionId, false)
}

const getCurrentLayerName = (map: mapboxgl.Map) => {
  let layerName = ''
  const zoom = map.getZoom()
  for (const tile of tiles) {
    if (zoom >= tile.minZoom && zoom <= tile.maxZoom) {
      layerName = tile.name
      break
    }
  }
  return layerName
}

const setTileActive = (
  map: mapboxgl.Map,
  id: string,
  active = true,
  layerName = getCurrentLayerName(map)
) => {
  if (!id) {
    debugger
  }
  if (active) {
    clearTileActive(map)
  }
  tileSetter(map, {
    source: layerName,
    sourceLayer: layerName,
    id,
  })({
    active: active ? true : null,
  })
  curRegionId = active ? id : null
}

const tileSetter =
  (map: mapboxgl.Map, feature: mapboxgl.FeatureIdentifier | mapboxgl.MapboxGeoJSONFeature) =>
  (state: { [key: string]: any }) => {
    map.setFeatureState(feature, state)
    map.setFeatureState(
      {
        ...feature,
        source: 'public.nhood_labels',
        sourceLayer: 'public.nhood_labels',
      },
      state
    )
  }

export default function Map(props: MapProps) {
  if (isM1Sim) {
    console.warn('m1 sim breaks...')
    // bug: https://github.com/mapbox/mapbox-gl-js/issues/10260
    return null
  }

  const { center, span, padding, features, style, hovered, selected, hideRegions, tileId } =
    props
  const isMounted = useIsMountedRef()
  const mapNode = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<mapboxgl.Map | null>(null)
  const getProps = useGet(props)
  const themeName = useThemeName() as any

  // window resize
  useEffect(() => {
    if (!map) return
    let cancel: Function | null = null
    const handleResize = debounce(() => {
      cancel = series([
        () => sleep(100),
        () => map.resize(),
        () => sleep(100),
        () => map.resize(),
        () => sleep(400),
        () => map.resize(),
        () => sleep(500),
        () => map.resize(),
      ])
    }, 50)
    const handleResizeOuter = () => {
      cancel?.()
      cancel = null
      handleResize.cancel()
      handleResize()
    }
    Dimensions.addEventListener('change', handleResizeOuter)
    return () => {
      cancel?.()
      handleResize.cancel()
      Dimensions.removeEventListener('change', handleResizeOuter)
    }
  }, [map])

  useEffect(() => {
    if (!tileId || !map) return
    console.warn('setting tileid', tileId)
    setTileActive(map, tileId, true)
  }, [map, tileId])

  // setup map!
  // NOTE! changing style resets all sources
  // so be sure to thread style through here
  useEffect(() => {
    if (!mapNode.current) return
    const isDark = themeName === 'dark'

    const map = new mapboxgl.Map({
      projection: 'globe',
      container: mapNode.current,
      style: props.style,
      center: props.center,
      zoom: 2,
      attributionControl: false,
      minZoom: 0,
      minPitch: 0,
      pitch: 5,
      maxPitch: 20,
    }).addControl(
      new mapboxgl.AttributionControl({
        compact: true,
      })
    )
    setMapGlobal(map)
    const padding = getProps().padding
    if (padding) {
      map.setPadding(padding)
    }

    window['map'] = map
    window['mapHelpers'] = mapHelpers

    const loadMarker = (name: string, asset: string) => {
      return new Promise((res, rej) => {
        if (!map) return rej()
        map.loadImage(asset, (err, image) => {
          if (err || !image || !map) return rej(err)
          if (!map.hasImage(name)) {
            map.addImage(name, image)
          }
          res(image)
        })
      })
    }

    const cancels = new Set<Function>()

    let isMouseDown = false
    let lastUpdate: MapRegionEvent | null = null

    function updateOnSelectRegion() {
      if (!curRegion || isMouseDown) return
      if (!isEqual(lastUpdate, curRegion)) {
        getProps().onSelectRegion?.(curRegion)
        if (curRegion) {
          lastUpdate = curRegion
        }
        curRegion = null
      } else {
        console.log('is same')
      }
    }

    const setRegionAtCenterActive = debounce(() => {
      const initialRegionSlug = getInitialRegionSlug()
      if (curRegionId || !initialRegionSlug) return
      const feature = getRegionAtCenter()
      if (!feature) return
      if (feature.id === curRegionId) return
      const props = getRegionNameAndSlug(feature)
      if (props.slug !== initialRegionSlug) return
      setCurrentRegion(feature, 'click')
    }, 100)

    const getRegionAtCenter = () => {
      const { padding } = getProps()
      const width = map.getContainer().clientWidth - padding.right
      const height = map.getContainer().clientHeight - padding.bottom
      const x = width / 2 + padding.left
      const y = height / 2 + padding.top
      try {
        const layerName = getCurrentLayerName(map)
        if (!layerName) return
        const features = map.queryRenderedFeatures(new mapboxgl.Point(x, y), {
          layers: [`${layerName}.fill`],
        })
        const feature = features[0]
        if (!feature) {
          return null
        }
        return feature
      } catch (err) {
        console.error('error querying map', err)
        return null
      }
    }

    const getRegionNameAndSlug = (feature: MapboxGeoJSONFeature) => {
      const props = feature.properties ?? {}
      const name =
        props.nhood ??
        (props.hrrcity
          ? props.hrrcity
              .toLowerCase()
              .replace('ca- ', '')
              .split(' ')
              .map((x) => capitalize(x))
              .join(' ')
          : '')
      return {
        name,
        slug: props.slug ?? slugify(name),
      }
    }

    function setCurrentRegion(feature: MapboxGeoJSONFeature, via: 'click' | 'drag') {
      try {
        // temp regions name supprot until data in db
        const nameAndSlug = getRegionNameAndSlug(feature)
        if (!nameAndSlug.name) {
          console.warn('No available region', feature)
          return
        }
        if (nameAndSlug.name === curRegion?.name) {
          console.log('same region, not changing')
          return
        }
        if (!feature.id) {
          console.warn('no id')
          return
        }
        setTileActive(map, `${feature.id}`, true)
        curRegion = {
          ...mapHelpers.polygonToMapPosition(feature.geometry as any),
          ...nameAndSlug,
          via,
          id: curRegionId,
        }
        updateOnSelectRegion()
      } catch (err) {
        console.error('error setting region', err)
      }
    }

    const mapMarkerRed = require('../assets/map-marker-red.png')

    cancels.add(
      series([
        () =>
          Promise.all([
            new Promise((res) => map.on('load', res)),
            new Promise((res) => map.on('idle', res)), // this waits for style load
            loadMarker('map-marker-red', mapMarkerRed),
            // loadMarker('icon-sushi', require('../assets/icon-sushi.png').default),
            // loadMarker(
            //   'map-pin-blank',
            //   require('../assets/map-pin-blank.png').default
            // ),
          ]),
        () => {
          if (!map) return

          map.on('sourcedata', () => {
            setRegionAtCenterActive()
          })

          // const firstSymbolLayerId = (() => {
          //   const layers = map.getStyle().layers
          //   if (!layers) return
          //   let val
          //   for (var i = 0; i < layers.length; i++) {
          //     if (layers[i].type === 'symbol') {
          //       val = layers[i].id
          //       break
          //     }
          //   }
          //   return val
          // })()

          let hovered

          const tileLayers = tiles.map((t) => `${t.name}.fill`)
          const getFeatures = (e) => {
            return map.queryRenderedFeatures(e.point, {
              layers: tileLayers,
            })
          }
          const handleMouseMove = throttle((e) => {
            const features = getFeatures(e)
            const [feature] = features
            if (
              feature &&
              hovered &&
              feature.source === hovered.source &&
              feature.id == hovered.id
            ) {
              return
            }

            if (hovered) {
              tileSetter(map, {
                source: hovered.source,
                sourceLayer: hovered.sourceLayer,
                id: hovered.id,
              })({
                hover: null,
              })
            }
            if (!feature) return
            hovered = feature
            tileSetter(map, {
              source: feature.source,
              sourceLayer: feature.sourceLayer,
              id: feature.id,
            })({
              hover: true,
            })
          }, 100)
          map.on('mousemove', handleMouseMove)
          cancels.add(() => {
            handleMouseMove.cancel()
            map.off('mousemove', handleMouseMove)
          })

          const handleClick = (e) => {
            if (!map) return
            const points = map.queryRenderedFeatures(e.point, {
              layers: [POINT_LAYER_ID],
            })
            const [point] = points
            if (point) {
              // zoom into a cluster
              const clusterId = point.properties?.cluster_id
              if (clusterId) {
                const source = map.getSource(RESTAURANTS_SOURCE_ID)
                if (source.type !== 'geojson') {
                  return
                }
                source.getClusterExpansionZoom(clusterId, function (err, zoom) {
                  if (err) return
                  map.easeTo({
                    center: points[0].geometry['coordinates'],
                    zoom: zoom * 1.1,
                  })
                  return
                })
              }
              if (point.properties?.id) {
                console.log('click set active')
                // click
                setActive(map, getProps(), internal, +(point?.id ?? 0))
                return
              } else {
                console.warn('no features', e)
              }
            }
            const layers = tiles.map((t) => `${t.name}.fill`)
            const boundaries = map.queryRenderedFeatures(e.point, {
              layers,
            })
            const boundary = boundaries[0]
            // properly unifies all the tile features before moving
            // see: https://github.com/mapbox/mapbox-gl-js/issues/3871
            // and: https://github.com/mapbox/mapbox-gl-js/issues/5040
            if (boundary && boundary.id) {
              setCurrentRegion(boundary, 'click')
              // get full boundary (mapbox weird)
              const sourceFeatures = map.querySourceFeatures(boundary.source, {
                sourceLayer: boundary.sourceLayer,
                filter: ['==', 'ogc_fid', boundary.id],
              })
              let final = sourceFeatures[0] as any
              for (const feature of sourceFeatures) {
                final = union(final, feature as any)
              }
              const bounds = bbox(final)
              map.fitBounds(bounds as any, {
                padding: 20,
              })
            }
          }
          map.on('click', handleClick)
          cancels.add(() => {
            map.off('click', handleClick)
          })

          map.addSource(RESTAURANTS_SOURCE_ID, {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: props.features,
            },
            generateId: true,

            // clustering
            cluster: true,
            clusterMaxZoom: 14,
            clusterRadius: 10,
            clusterMinPoints: 60,
          })

          map.addSource(RESTAURANTS_UNCLUSTERED_SOURCE_ID, {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: props.features,
            },
            generateId: true,
          })

          const pointColor =
            themeName === 'dark'
              ? hexToRGB(lightColors.pink3, 0.44).string
              : hexToRGB(lightColors.pink10, 0.44).string
          map.addLayer({
            id: POINT_LAYER_ID,
            type: 'circle',
            source: RESTAURANTS_SOURCE_ID,
            paint: {
              'circle-radius': [
                'case',
                ['boolean', ['feature-state', 'hover'], false],
                14 * (supportsTouchWeb ? 1.2 : 0.75),
                11 * (supportsTouchWeb ? 1.2 : 0.75),
              ],
              'circle-color': [
                'match',
                ['get', 'selected'],
                1,
                'yellow',
                0,
                pointColor,
                pointColor,
              ],
            },
          })
          cancels.add(() => {
            map.removeLayer(POINT_LAYER_ID)
          })

          // map.addLayer({
          //   id: POINT_HOVER_LAYER_ID,
          //   source: RESTAURANTS_UNCLUSTERED_SOURCE_ID,
          //   type: 'circle',
          //   filter: ['==', 'id', ''],
          //   paint: {
          //     'circle-radius': 6,
          //     'circle-color': '#fff',
          //     // 'icon-allow-overlap': true,
          //     // 'icon-ignore-placement': true,
          //     // 'icon-size': 0.25,
          //   },
          // })
          // cancels.add(() => {
          //   map.removeLayer(POINT_HOVER_LAYER_ID)
          // })

          map.addLayer({
            id: UNCLUSTERED_LABEL_LAYER_ID,
            source: RESTAURANTS_SOURCE_ID,
            type: 'symbol',
            filter: ['!', ['has', 'point_count']],
            layout: {
              // markers
              // 'icon-anchor': 'top',
              // 'icon-keep-upright': true,
              // 'symbol-placement': 'point',
              // 'icon-pitch-alignment': 'viewport',
              // 'icon-offset': [0, -120],
              // 'icon-image': 'map-marker-red',
              // 'icon-size': 0.3333,
              // 'icon-allow-overlap': true,
              // 'icon-ignore-placement': true,
              'text-field': ['format', ['get', 'title']],
              'text-font': ['DIN Offc Pro Bold', 'Arial Unicode MS Bold'],
              'text-size': 14,
              'text-line-height': 1,
              'text-variable-anchor': ['bottom'],
              // 'text-offset': [0, 20],
              // 'text-anchor': 'bottom',
            },
            paint: {
              'text-color': isDark ? lightColors.pink4 : lightColors.pink10,
              // 'text-halo-color': blue,
              // 'text-halo-width': 1,
            },
          })
          cancels.add(() => {
            map.removeLayer(UNCLUSTERED_LABEL_LAYER_ID)
          })

          map.addLayer({
            id: RESTAURANT_RANK_LABEL_ID,
            source: RESTAURANTS_SOURCE_ID,
            type: 'symbol',
            filter: ['has', 'searchPosition'],
            layout: {
              'text-allow-overlap': true,
              'icon-allow-overlap': true,
              // 'icon-ignore-placement': true,
              'text-field': ['format', ['get', 'searchPosition']],
              'text-font': ['DIN Offc Pro Bold', 'Arial Unicode MS Bold'],
              'text-size': 26,
              'text-variable-anchor': ['right', 'left', 'top', 'bottom'],
              'text-anchor': 'center',
            },
            paint: {
              'text-color': isDark ? '#fff' : '#000',
              // 'text-halo-color': 'rgba(255,255,255,0.5)',
              // 'text-halo-width': 1,
            },
          })
          cancels.add(() => {
            map.removeLayer(RESTAURANT_RANK_LABEL_ID)
          })

          map.addLayer({
            id: CLUSTER_LABEL_LAYER_ID,
            type: 'symbol',
            source: RESTAURANTS_SOURCE_ID,
            filter: ['has', 'point_count'],
            layout: {
              'text-field': [
                'format',
                ['get', 'point_count_abbreviated'],
                { 'font-scale': 1.1 },
                '\n',
                ['get', 'name'],
              ],
              'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
              'text-offset': [0, -0.1],
              'text-size': 12,
            },
            paint: {
              'text-halo-color': 'rgba(255,255,255,0.5)',
              'text-halo-width': 1,
            },
          })
          cancels.add(() => {
            map.removeLayer(CLUSTER_LABEL_LAYER_ID)
          })

          // start making regions
          for (const tile of tiles) {
            const {
              maxZoom,
              minZoom,
              label,
              labelSource,
              name,
              promoteId,
              lineColor,
              lineColorActive,
              lineColorHover,
              color,
              hoverColor,
              activeColor,
            } = tile

            map.addSource(name, {
              type: 'vector',
              url: `${TILES_HOST}/${name}.json`,
              promoteId,
            })

            map.addLayer({
              id: `${name}.fill`,
              type: 'fill',
              source: name,
              minzoom: minZoom,
              maxzoom: maxZoom,
              paint: {
                'fill-opacity': [
                  'case',
                  ['==', ['feature-state', 'active'], true],
                  1.0,
                  ['==', ['feature-state', 'hover'], true],
                  isDark ? 0.5 : 0.1,
                  ['==', ['feature-state', 'active'], null],
                  isDark ? 0.25 : 0.05,
                  0,
                ],
                'fill-color': [
                  'case',
                  ['==', ['feature-state', 'active'], true],
                  activeColor,
                  ['==', ['feature-state', 'hover'], true],
                  ['get', 'color'],
                  ['==', ['feature-state', 'active'], null],
                  ['case', ['has', 'color'], ['get', 'color'], 'rgba(100,200,100,0.14)'],
                  'green',
                ],
              },
              'source-layer': name,
            })

            // map.addLayer({
            //   id: `${name}.line`,
            //   type: 'line',
            //   source: name,
            //   minzoom: minZoom,
            //   maxzoom: maxZoom,
            //   paint: {
            //     'line-color': [
            //       'case',
            //       ['==', ['feature-state', 'active'], true],
            //       ['get', 'color'],
            //       ['==', ['feature-state', 'hover'], true],
            //       ['get', 'color'],
            //       ['==', ['feature-state', 'active'], null],
            //       'rgba(0,0,0,0.1)',
            //       'green',
            //     ],
            //     'line-opacity': 1,
            //     'line-width': 0.5,
            //   },
            //   'source-layer': name,
            // })

            if (label) {
              if (labelSource) {
                map.addSource(labelSource, {
                  type: 'vector',
                  url: `${TILES_HOST}/${labelSource}.json`,
                  promoteId: 'ogc_fid',
                })
              }
              map.addLayer({
                id: `${name}.label`,
                // TODO move it to a centroid computed source
                source: labelSource ?? name,
                'source-layer': labelSource ?? name,
                type: 'symbol',
                minzoom: minZoom,
                maxzoom: maxZoom,
                layout: {
                  'text-field': `{${label}}`,
                  'text-font': ['PT Sans Bold', 'Arial Unicode MS Bold'],
                  // 'text-allow-overlap': true,
                  'text-variable-anchor': ['center', 'center'],
                  // 'text-radial-offset': 10,
                  // 'icon-allow-overlap': true,
                  'text-size': {
                    base: 1,
                    stops: [
                      [10, 8],
                      [16, 26],
                    ],
                  },
                  'text-justify': 'center',
                  'symbol-placement': 'point',
                },
                paint: {
                  'text-color': [
                    'case',
                    ['==', ['feature-state', 'active'], true],
                    isDark ? '#fff' : '#000',
                    ['==', ['feature-state', 'hover'], true],
                    isDark ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,0.5)',
                    ['==', ['feature-state', 'active'], null],
                    isDark ? 'rgba(255,255,255,0.85)' : 'rgba(0,0,0,0.33)',
                    'green',
                  ],
                  // 'text-halo-color': 'rgba(255,255,255,0.1)',
                  // 'text-halo-width': 1,
                },
              })
            }

            cancels.add(() => {
              map.removeLayer(`${name}.fill`)
              map.removeLayer(`${name}.line`)
              if (label) {
                map.removeLayer(`${name}.label`)
              }
              if (labelSource) {
                map.removeSource(labelSource)
              }
              map.removeSource(name)
            })
          }
          // end making regions

          type Event = mapboxgl.MapMouseEvent & {
            features?: mapboxgl.MapboxGeoJSONFeature[]
          } & mapboxgl.EventData
          type Listener = (ev: Event) => void

          let lastHoverCbVal = null
          function callbackOnHover(val: any) {
            if (val !== lastHoverCbVal) {
              lastHoverCbVal = val
              getProps().onHover?.(val)
            }
          }

          let hoverIdInt = null as null | number
          const setHovered = (e: Event, hover: boolean) => {
            if (!map) return
            map.getCanvas().style.cursor = hover ? 'pointer' : ''

            // only one at a time
            if (hoverIdInt != null) {
              mapSetFeature(map, hoverIdInt, { hover: false })
              hoverIdInt = null
            }
            const id = e.features?.[0].id ?? -1
            if (id > -1 && hoverIdInt != id) {
              if (hover) {
                hoverIdInt = +id
                mapSetFeature(map, hoverIdInt, { hover: true })
              }
            }
            const { features } = getProps()
            callbackOnHover(
              (() => {
                if (id > -1) {
                  const feature = features[+id]
                  return feature?.properties?.id ?? null
                }
                return null
              })()
            )
          }

          const pointMouseEnter: Listener = (e) => {
            setHovered(e, true)
          }
          map.on('mousemove', POINT_LAYER_ID, pointMouseEnter)
          cancels.add(() => {
            map.off('mousemove', POINT_LAYER_ID, pointMouseEnter)
          })

          function pointMouseLeave() {
            callbackOnHover(null)
            if (map) {
              map.getCanvas().style.cursor = ''
            }
          }
          map.on('mouseleave', POINT_LAYER_ID, pointMouseLeave)
          cancels.add(() => {
            map.off('mouseleave', POINT_LAYER_ID, pointMouseLeave)
          })

          /*
          Send back current location on move end
        */
          let lastLoc = getCurrentLocation(map)
          const handleMoveEndDebounced = _.debounce(() => {
            if (!isMounted.current) return
            if (!map) return
            // ignore same location
            const next = getCurrentLocation(map)
            if (isEqual(lastLoc, next)) {
              return
            }
            lastLoc = next
            props.onMoveEnd?.(next)
          }, 100)

          const handleMoveEnd = () => {
            if (internal.preventMoveEnd) {
              return
            }
            handleMoveEndDebounced()
          }

          internal.currentMoveCancel = handleMoveEndDebounced.cancel

          const handleMoveStart = () => {
            handleMoveEndDebounced.cancel()
            props.onMoveStart?.()
          }

          const handleMouseDown = () => {
            handleMoveEndDebounced.cancel()
            isMouseDown = true
          }

          const handleMouseUp = () => {
            isMouseDown = false
            updateOnSelectRegion()
          }

          map.on('mousedown', handleMouseDown)
          map.on('mouseup', handleMouseUp)
          map.on('movestart', handleMoveStart)
          map.on('moveend', handleMoveEnd)
          cancels.add(() => {
            map.off('mousedown', handleMouseDown)
            map.off('mouseup', handleMouseUp)
            map.off('movestart', handleMoveStart)
            map.off('moveend', handleMoveEnd)
          })

          const handleMove: Listener = () => {
            // setRegionAtCenterActive()
            handleMoveEndDebounced.cancel()
          }
          map.on('move', handleMove)
          map.on('movestart', handleMove)
          cancels.add(() => {
            map.off('move', handleMove)
            map.off('movestart', handleMove)
          })

          const handleDoubleClick: Listener = (e) => {
            const id = e.features?.[0]?.id ?? -1
            const feature = props.features[+id]
            if (feature) {
              props.onDoubleClick?.(feature.properties?.id)
            }
          }
          map.on('dblclick', CLUSTER_LABEL_LAYER_ID, handleDoubleClick)
          cancels.add(() => {
            map.off('dblclick', CLUSTER_LABEL_LAYER_ID, handleDoubleClick)
          })

          // remove sources last
          cancels.add(() => {
            map.removeSource(RESTAURANTS_SOURCE_ID)
            map.removeSource(RESTAURANTS_UNCLUSTERED_SOURCE_ID)
          })
        },
        () => {
          map.resize()
          setMap(map)
          if (map) {
            props.mapRef?.(map)
          }
        },
      ])
    )

    return () => {
      console.warn('❌ cleaning up effect')
      cancels.forEach((c) => c())
      if (mapNode.current) {
        mapNode.current.innerHTML = ''
      }
    }
  }, [themeName])

  // hide regions
  useEffect(() => {
    if (!map) return
    if (hideRegions) {
      for (const tile of tiles) {
        map.setLayoutProperty(`${tile.name}.fill`, 'visibility', 'none')
        map.setLayoutProperty(`${tile.name}.label`, 'visibility', 'none')
        // map.setLayoutProperty(`${tile.name}.line`, 'visibility', 'none')
      }
      return () => {
        for (const tile of tiles) {
          map.setLayoutProperty(`${tile.name}.fill`, 'visibility', 'visible')
          map.setLayoutProperty(`${tile.name}.label`, 'visibility', 'visible')
          // map.setLayoutProperty(`${tile.name}.line`, 'visibility', 'visible')
        }
      }
    }
  }, [map, hideRegions])

  // style
  useEffect(() => {
    if (!map) return
    if (!hasChangedStyle(map, style!)) return
    map.setStyle(style!)
  }, [map, style])

  // selected
  useEffect(() => {
    if (!selected) return
    if (!map) return
    const index = features.findIndex((x) => x.properties?.id === selected)
    setActive(map, props, internal, index, false)
  }, [map, features, selected])

  const prevHoveredId = useRef<number>()

  // hovered
  useEffect(() => {
    if (!map) return
    if (!hovered) return
    // mapSetIconHovered(map, index)
    // const index = features.findIndex((x) => x.properties?.id === hovered)
    // map.setFilter(POINT_HOVER_LAYER_ID, ['==', 'id', hovered])

    if (prevHoveredId.current != null) {
      mapSetFeature(map, prevHoveredId.current, { hover: false })
    }
    const index = features.findIndex((feature) => feature.properties?.id === hovered)

    if (index === -1) {
      return
    }

    prevHoveredId.current = index
    mapSetFeature(map, index, { hover: true })

    const feature = features[index]
    if (!feature || feature.geometry.type !== 'Point') {
      return
    }

    const popup = new mapboxgl.Popup({
      className: 'map-marker',
      closeButton: false,
      offset: 12,
    })
      .setLngLat(
        new mapboxgl.LngLat(feature.geometry.coordinates[0], feature.geometry.coordinates[1])
      )
      .setHTML(`${feature.properties?.title}`)
      .addTo(map)

    return () => {
      popup.remove()
    }
  }, [map, hovered, features])

  // center + span
  useEffect(() => {
    if (!map) return

    // be sure to cancel next move callback
    internal.currentMoveCancel?.()

    // west, south, east, north
    const next = mapPositionToBBox({ center, span })
    const shouldMove = hasMovedAtLeast(getCurrentLocation(map), { center, span })
    if (shouldMove) {
      const duration = 400
      const cancelSeries = series([
        () => {
          internal.preventMoveEnd = true
        },
        () => fullyIdle({ checks: 1, max: 50 }),
        () => {
          console.warn('fit bounds to', next)
          map!.fitBounds(next, {
            duration,
            padding,
          })
        },
        () => sleep(duration),
        () => {
          internal.preventMoveEnd = false
        },
      ])
      return () => {
        cancelSeries()
        internal.preventMoveEnd = false
      }
    }

    return undefined
  }, [map, span.lat, span.lng, center.lat, center.lng, padding])

  // padding
  useEffect(() => {
    if (!map) return
    // @ts-ignore no types for this yet
    map?.easeTo({ padding })
  }, [map, JSON.stringify(padding)])

  // features
  useEffect(() => {
    if (!map) return
    const source = map.getSource(RESTAURANTS_SOURCE_ID)
    const source2 = map.getSource(RESTAURANTS_UNCLUSTERED_SOURCE_ID)
    if (!(source || source2)) return

    if (props.showRank) {
      const MAX = 10
      for (const [index, feature] of features.slice(0, MAX).entries()) {
        feature.properties!.searchPosition = index + 1
      }
    }
    if (source?.type === 'geojson') {
      source.setData({
        type: 'FeatureCollection',
        features: features,
      })
    }
    if (source2?.type === 'geojson') {
      source2.setData({
        type: 'FeatureCollection',
        features: features,
      })
    }
  }, [features, map, props.showRank])

  return <div ref={mapNode} style={mapStyle} />
}

const mapStyle = {
  width: '100%',
  height: '100%',
  maxHeight: '100%',
  maxWidth: '100%',
  overflow: 'hidden',
  // background: '#CAEAF8', // water bg color
}

const mapSetFeature = (map: mapboxgl.Map, id: any, obj: any) => {
  map.setFeatureState(
    {
      source: RESTAURANTS_SOURCE_ID,
      id,
    },
    obj
  )
}

// this is inside memo...
const setActive = (
  map: mapboxgl.Map,
  { onSelect, features }: MapProps,
  internal: MapInternalState,
  internalId: number,
  shouldCallback = true
) => {
  if (!features.length) return
  const cur = internal.active
  if (cur != null) {
    mapSetFeature(map, internalId, { active: false })
  }
  if (internalId > -1) {
    internal.active = internalId
    mapSetFeature(map, internalId, { active: true })
    const feature = features[+internalId]
    if (feature) {
      if (shouldCallback) {
        onSelect?.(feature.properties?.id)
      }
    }
  }
}

const getCurrentLocation = (map: mapboxgl.Map) => {
  const mapCenter = map.getCenter()
  const bounds = map.getBounds()
  const center = {
    lng: mapCenter.lng,
    lat: mapCenter.lat,
  }
  const span = {
    lng: mapCenter.lng - bounds.getWest(),
    lat: bounds.getNorth() - mapCenter.lat,
  }

  const padding = map.getPadding()
  // super hacky, because they behave differently we are handling logic differently
  if (padding.left > padding.bottom) {
    const size = {
      width: map.getContainer().clientWidth,
      height: map.getContainer().clientHeight,
    }
    const lngSpan = bounds.getEast() - bounds.getWest()
    const latSpan = bounds.getNorth() - bounds.getSouth()
    const latExtra = (padding.top / size.height) * latSpan
    const lngExtra = ((padding.left + padding.right) / size.width) * lngSpan
    span.lng -= lngExtra
    span.lat -= latExtra
    // center.lng += (padding.right / 2 / size.height) * lngSpan
  } else {
    const size = {
      width: map.getContainer().clientWidth,
      height: map.getContainer().clientHeight,
    }
    const lngSpan = bounds.getEast() - bounds.getWest()
    const latSpan = bounds.getNorth() - bounds.getSouth()
    const latExtra = (padding.top / size.height) * latSpan
    const lngExtra = ((padding.left + padding.right) / 2 / size.width) * lngSpan
    span.lng -= lngExtra
    span.lat -= latExtra
  }

  return {
    center: { lng: round(center.lng), lat: round(center.lat) },
    span: { lng: round(span.lng), lat: round(span.lat) },
  }
}
window['mapboxgl'] = mapboxgl
window['getCurrentLocation'] = getCurrentLocation

//['get', 'color'],
// rgbString(tagLenses[0].rgb.map((x) => x + 45)),
// [
//   'get',
//   'color',
//   // rgbString(tagLenses[0].rgb.map((x) => x + 45)),
// ],
// [
//   'match',
//   ['get', 'ethnicity'],
//   'White',
//   '#fbb03b',
//   'Black',
//   '#223b53',
//   'Hispanic',
//   '#e55e5e',
//   'Asian',
//   '#3bb2d0',
//   /* other */ '#ccc'
//   ]
// // show center/sw/ne points on map for debugging
// if (process.env.NODE_ENV === 'development') {
//   if (false) {
//     const source = map.getSource(RESTAURANTS_SOURCE_ID)
//     if (source?.type === 'geojson') {
//       source.setData({
//         type: 'FeatureCollection',
//         features: [
//           ...features,
//           // debug: add the sw, ne points
//           {
//             type: 'Feature',
//             id: Math.random(),
//             geometry: {
//               type: 'Point',
//               coordinates: [center.lng, center.lat],
//             },
//             properties: {
//               color: 'orange',
//             },
//           },
//           {
//             type: 'Feature',
//             id: Math.random(),
//             geometry: {
//               type: 'Point',
//               coordinates: [next[0], next[1]],
//             },
//             properties: {
//               color: 'blue',
//             },
//           },
//           {
//             type: 'Feature',
//             id: Math.random(),
//             geometry: {
//               type: 'Point',
//               coordinates: [next[2], next[3]],
//             },
//             properties: {
//               color: 'blue',
//             },
//           },
//         ],
//       })
//     }
//   }
// }

// only way to check if matching, i believe
function hasChangedStyle(map: mapboxgl.Map, style: string) {
  const { sprite } = map.getStyle()
  return !sprite?.includes(style.replace('mapbox://styles', ''))
}

// // IF NEAR BOUNDARY DONT AUTO SELECT
// const zoom = map.getZoom()
// for (const tile of tiles) {
//   const [min, max] = [tile.minZoom, tile.maxZoom]
//   const isNear = (x: number) => Math.abs(zoom - x) < x * 0.1
//   const isNearBoundary = isNear(min) || isNear(max)
//   if (curRegionId && isNearBoundary) {
//     console.warn('near border')
//     return
//   }
// }
