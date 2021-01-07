import 'mapbox-gl/dist/mapbox-gl.css'

import { fullyIdle, series } from '@dish/async'
import { isDev, isStaging, slugify } from '@dish/graph'
import bbox from '@turf/bbox'
import center from '@turf/center'
import { produce } from 'immer'
import _, { capitalize, isEqual, throttle } from 'lodash'
import mapboxgl from 'mapbox-gl'
import React, { useEffect, useRef, useState } from 'react'
import { Dimensions } from 'react-native'
import { useGet } from 'snackui'

import { blue, green, purple } from '../../constants/colors'
import { MAPBOX_ACCESS_TOKEN } from '../../constants/constants'
import { tagLenses } from '../../constants/localTags'
import { hasMovedAtLeast } from '../../helpers/hasMovedAtLeast'
import { hexToRGB } from '../../helpers/hexToRGB'
import { useIsMountedRef } from '../../helpers/useIsMountedRef'
import { useSearchResultsStore } from '../home/search/searchResultsStore'
import { MapProps } from './MapProps'

mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN

const RESTAURANTS_SOURCE_ID = 'RESTAURANTS_SOURCE_ID'
const RESTAURANTS_UNCLUSTERED_SOURCE_ID = 'RESTAURANTS_UNCLUSTERED_SOURCE_ID'
const RESTAURANT_RANK_LABEL_ID = 'RESTAURANT_RANK_LABEL_ID'
const UNCLUSTERED_LABEL_LAYER_ID = 'UNCLUSTERED_LABEL_LAYER_ID'
const CLUSTER_LABEL_LAYER_ID = 'CLUSTER_LABEL_LAYER_ID'
const POINT_LAYER_ID = 'POINT_LAYER_ID'
const POINT_HOVER_LAYER_ID = 'POINT_HOVER_LAYER_ID'

const MARTIN_TILES_HOST = (() => {
  const prod = 'https://martin-tiles.dishapp.com'
  const staging = 'https://martin-tiles-staging.dishapp.com'
  const dev = 'http://localhost:3005'
  if (isStaging) return staging
  if (isDev) return dev
  return prod
})()

const round = (val: number, dec = 100000) => {
  return Math.round(val * dec) / dec
}

type MapInternalState = {
  active: null | number
  hasSetInitialSource: boolean
  currentMoveCancel: Function | null
  isAwaitingNextMove: boolean
}

export const MapView = (props: MapProps) => {
  const { center, span, padding, features, style, hovered, selected } = props
  const isMounted = useIsMountedRef()
  const mapNode = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<mapboxgl.Map | null>(null)
  const internal = useRef<MapInternalState>()
  if (!internal.current) {
    internal.current = {
      active: null as null | number,
      hasSetInitialSource: false,
      currentMoveCancel: null as Function | null,
      isAwaitingNextMove: false,
    }
  }
  const getProps = useGet(props)

  // window resize
  useEffect(() => {
    if (!map) return undefined
    let cancel: Function | null = null
    const handleResize = () => {
      if (cancel) {
        cancel()
      }
      cancel = series([() => fullyIdle({ max: 300 }), () => map.resize()])
    }
    Dimensions.addEventListener('change', handleResize)
    return () => {
      cancel?.()
      Dimensions.removeEventListener('change', handleResize)
    }
  }, [map])

  // setup map!
  // NOTE! changing style resets all sources
  // so be sure to thread style through here
  useEffect(() => {
    if (!mapNode.current) return
    return setupMapEffect({
      mapNode: mapNode.current,
      isMounted,
      setMap,
      getProps,
      props,
      internal,
    })
  }, [])

  useEffect(() => {
    if (!map) return
    if (!hasChangedStyle(map, style)) return
    map.setStyle(style)
  }, [map, style])

  // selected
  useEffect(() => {
    if (!selected) return
    if (!map) return
    const index = features.findIndex((x) => x.properties?.id === selected)
    setActive(map, props, internal.current, index, false)
  }, [map, features, selected])

  const prevHoveredId = useRef<number>()

  // hovered
  useEffect(() => {
    if (!map) return
    if (!hovered) return
    // mapSetIconHovered(map, index)
    // const index = features.findIndex((x) => x.properties?.id === hovered)
    map.setFilter(POINT_HOVER_LAYER_ID, ['==', 'id', hovered])

    if (prevHoveredId.current != null) {
      mapSetFeature(map, prevHoveredId.current, { hover: false })
    }
    const featureId = features.findIndex(
      (feature) => feature.properties.id === hovered
    )

    if (featureId !== -1) {
      prevHoveredId.current = featureId
      mapSetFeature(map, featureId, { hover: true })
    }
    // return animateMarker(map)
  }, [map, hovered, features])

  // center + span
  useEffect(() => {
    if (!map) return undefined

    // be sure to cancel next move callback
    internal.current.currentMoveCancel?.()

    // west, south, east, north
    const next: [number, number, number, number] = [
      center.lng - span.lng,
      center.lat - span.lat,
      center.lng + span.lng,
      center.lat + span.lat,
    ]

    if (hasMovedAtLeast(getCurrentLocation(map), { center, span })) {
      internal.current.isAwaitingNextMove = true
      const cancelSeries = series([
        () => fullyIdle({ max: 500 }),
        () => {
          map?.fitBounds(next, {
            duration: 650,
          })
          internal.current.isAwaitingNextMove = false
        },
      ])
      return () => {
        cancelSeries()
        internal.current.isAwaitingNextMove = false
      }
    }

    return undefined
  }, [map, span.lat, span.lng, center.lat, center.lng])

  // padding
  useEffect(() => {
    if (!map) return
    // @ts-ignore no types for this yet
    map?.easeTo({ padding })
  }, [map, JSON.stringify(padding)])

  const { restaurantPositions } = useSearchResultsStore()

  // features
  useEffect(() => {
    if (!map) return
    const source = map.getSource(RESTAURANTS_SOURCE_ID)
    const source2 = map.getSource(RESTAURANTS_UNCLUSTERED_SOURCE_ID)

    if (!source) {
      console.warn('NO SOURCE??', source)
      return
    }
    if (!source2) {
      console.warn('NO SOURCE (UNCLUSTERED)???', source2)
      return
    }

    const featuresWithPositions = produce(features, (draft) => {
      for (const feature of draft) {
        const position = restaurantPositions[feature.properties.id]
        if (position != null && position <= 10) {
          feature.properties.searchPosition = position
        }
      }
    })

    if (source?.type === 'geojson') {
      source.setData({
        type: 'FeatureCollection',
        features: featuresWithPositions,
      })
    }

    if (source2?.type === 'geojson') {
      source2.setData({
        type: 'FeatureCollection',
        features: featuresWithPositions,
      })
    }
  }, [features, map, restaurantPositions])

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

type Tile = {
  name: string
  label: string
  maxZoom: number
  minZoom: number
  labelSource?: string
  promoteId: string
  lineColor?: string
  lineColorActive?: string
  lineColorHover?: string
  color: string
  hoverColor: string
  activeColor: string
}

const tiles: Tile[] = [
  {
    maxZoom: 20,
    minZoom: 12,
    // lineColor: '#880088',
    // lineColorActive: '#660066',
    // lineColorHover: '#330033',
    label: 'name',
    labelSource: 'public.nhood_labels',
    promoteId: 'ogc_fid',
    activeColor: 'rgba(255, 255, 255, 0)',
    hoverColor: 'rgba(255,255,255,0.2)',
    color: 'rgba(248, 238, 248, 0.5)',
    name: 'public.zcta5',
  },
  // {
  //   maxZoom: 11,
  //   minZoom: 9,
  //   lineColor: '#880088',
  //   promoteId: 'ogc_fid',
  //   activeColor: purple,
  //   hoverColor: 'yellow',
  //   color: lightPurple,
  //   label: 'nhood',
  //   name: 'public.hca',
  // },
  {
    maxZoom: 12,
    minZoom: 7,
    // lineColor: '#aa55aa',
    // lineColorActive: '#660066',
    // lineColorHover: '#330033',
    promoteId: 'ogc_fid',
    activeColor: `rgba(255, 255, 255, 0)`,
    hoverColor: hexToRGB(purple, 0.05).string,
    color: hexToRGB(purple, 0.25).string,
    label: 'hrr_city',
    name: 'public.hrr',
  },
  {
    maxZoom: 7,
    minZoom: 0,
    // lineColor: '#880088',
    // lineColorActive: '#660066',
    // lineColorHover: '#330033',
    promoteId: 'ogc_fid',
    activeColor: green,
    hoverColor: 'yellow',
    color: purple,
    label: null,
    name: 'public.state',
  },
]

function setupMapEffect({
  setMap,
  props,
  mapNode,
  internal,
  isMounted,
  getProps,
}: {
  setMap: React.Dispatch<React.SetStateAction<mapboxgl.Map>>
  props: MapProps
  mapNode: HTMLElement
  internal: React.MutableRefObject<MapInternalState>
  isMounted?: React.RefObject<boolean>
  getProps: () => MapProps
}) {
  const map = new mapboxgl.Map({
    container: mapNode,
    style: props.style,
    center: props.center,
    zoom: 11,
    attributionControl: false,
  }).addControl(
    new mapboxgl.AttributionControl({
      compact: true,
    })
  )

  const padding = getProps().padding
  if (padding) {
    map.setPadding(padding)
  }

  window['map'] = map

  // const loadMarker = (name: string, asset: string) => {
  //   return new Promise((res, rej) => {
  //     if (!map) return rej()
  //     map.loadImage(asset, (err, image) => {
  //       if (err) return rej(err)
  //       if (map) {
  //         if (!map.hasImage(name)) {
  //           map.addImage(name, image)
  //         }
  //       }
  //       res(image)
  //     })
  //   })
  // }

  const cancels = new Set<Function>()

  cancels.add(
    series([
      () =>
        Promise.all([
          new Promise((res) => map.on('load', res)),
          new Promise((res) => map.on('idle', res)), // this waits for style load
          // loadMarker('map-pin', require('../assets/map-pin.png').default),
          // loadMarker('icon-sushi', require('../assets/icon-sushi.png').default),
          // loadMarker(
          //   'map-pin-blank',
          //   require('../assets/map-pin-blank.png').default
          // ),
        ]),
      () => {
        if (!map) return

        const firstSymbolLayerId = (() => {
          const layers = map.getStyle().layers
          let val
          for (var i = 0; i < layers.length; i++) {
            if (layers[i].type === 'symbol') {
              val = layers[i].id
              break
            }
          }
          return val
        })()

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
            url: `${MARTIN_TILES_HOST}/${name}.json`,
            promoteId,
          })

          map.addLayer(
            {
              id: `${name}.fill`,
              type: 'fill',
              source: name,
              minzoom: minZoom,
              maxzoom: maxZoom,
              paint: {
                'fill-color': [
                  'case',
                  ['==', ['feature-state', 'active'], true],
                  activeColor,
                  ['==', ['feature-state', 'hover'], true],
                  hoverColor,
                  ['==', ['feature-state', 'active'], null],
                  color,
                  'green',
                ],
                'fill-opacity': 1,
              },
              'source-layer': name,
            },
            firstSymbolLayerId
          )

          if (lineColor) {
            map.addLayer(
              {
                id: `${name}.line`,
                type: 'line',
                source: name,
                minzoom: minZoom,
                maxzoom: maxZoom,
                paint: {
                  'line-color': [
                    'case',
                    ['==', ['feature-state', 'active'], true],
                    lineColorActive,
                    ['==', ['feature-state', 'hover'], true],
                    lineColorHover,
                    ['==', ['feature-state', 'active'], null],
                    lineColor,
                    'green',
                  ],
                  'line-opacity': 0.05,
                  'line-width': [
                    'case',
                    ['==', ['feature-state', 'active'], true],
                    1,
                    ['==', ['feature-state', 'hover'], true],
                    2,
                    ['==', ['feature-state', 'active'], null],
                    3,
                    4,
                  ],
                },
                'source-layer': name,
              },
              firstSymbolLayerId
            )
          }

          if (label) {
            if (labelSource) {
              map.addSource(labelSource, {
                type: 'vector',
                url: `${MARTIN_TILES_HOST}/${labelSource}.json`,
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
                'text-font': ['PT Serif Bold', 'Arial Unicode MS Bold'],
                // 'text-allow-overlap': true,
                'text-variable-anchor': ['center', 'center'],
                'text-radial-offset': 10,
                // 'icon-allow-overlap': true,
                'text-size': {
                  base: 1,
                  stops: [
                    [10, 6],
                    [16, 22],
                  ],
                },
                'text-justify': 'center',
                'symbol-placement': 'point',
              },
              paint: {
                'text-color': [
                  'case',
                  ['==', ['feature-state', 'active'], true],
                  '#000',
                  ['==', ['feature-state', 'hover'], true],
                  green,
                  ['==', ['feature-state', 'active'], null],
                  'rgba(0,0,0,0.8)',
                  'green',
                ],
                'text-halo-color': 'rgba(255,255,255,0.1)',
                'text-halo-width': 1,
              },
            })
          }

          cancels.add(() => {
            map.removeLayer(`${name}.fill`)
            if (lineColor) {
              map.removeLayer(`${name}.line`)
            }
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

        const tileSetter = (
          feature: mapboxgl.FeatureIdentifier | mapboxgl.MapboxGeoJSONFeature
        ) => (state: { [key: string]: any }) => {
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

        let curId
        const handleMoveThrottled = throttle(() => {
          const zoom = map.getZoom()
          const { padding } = getProps()
          const width = map.getContainer().clientWidth - padding.right
          const height = map.getContainer().clientHeight - padding.bottom
          const x = width / 2 + padding.left
          const y = height / 2 + padding.top
          let layerName = ''
          for (const tile of tiles) {
            if (zoom > tile.minZoom && zoom < tile.maxZoom) {
              layerName = tile.name
              break
            }
          }
          if (!layerName) return
          const features = map.queryRenderedFeatures(new mapboxgl.Point(x, y), {
            layers: [`${layerName}.fill`],
          })
          const feature = features[0]
          if (!feature) return
          if (feature.id === curId) return

          if (curId) {
            tileSetter({
              source: layerName,
              sourceLayer: layerName,
              id: curId,
            })({
              active: null,
            })
            curId = null
          }
          curId = feature.id
          tileSetter({
            source: layerName,
            sourceLayer: layerName,
            id: curId,
          })({
            active: true,
          })

          // temp reginos supprot until we normalize naming at tile level
          const name =
            feature.properties.nhood ??
            (feature.properties.hrrcity
              ? feature.properties.hrrcity
                  .toLowerCase()
                  .replace('ca- ', '')
                  .split(' ')
                  .map((x) => capitalize(x))
                  .join(' ')
              : '')
          if (!name) {
            console.warn('No available region', feature)
            return
          }

          getProps().onSelectRegion?.({
            geometry: feature.geometry as any,
            name: name,
            slug: feature.properties.slug ?? slugify(name),
          })
        }, 300)

        let hovered
        const getFeatures = (e) => {
          return map.queryRenderedFeatures(e.point, {
            layers: tiles.map((t) => `${t.name}.fill`),
          })
        }
        const handleHover = throttle((e) => {
          const [feature] = getFeatures(e)
          if (
            feature &&
            hovered &&
            feature.source === hovered.source &&
            feature.id == hovered.id
          ) {
            return
          }

          if (hovered) {
            tileSetter({
              source: hovered.source,
              sourceLayer: hovered.sourceLayer,
              id: hovered.id,
            })({
              hover: null,
            })
          }
          if (!feature) return
          hovered = feature
          tileSetter({
            source: feature.source,
            sourceLayer: feature.sourceLayer,
            id: feature.id,
          })({
            hover: true,
          })
        }, 32)
        map.on('mousemove', handleHover)
        cancels.add(() => {
          map.off('mousemove', handleHover)
        })

        const handleClick = (e) => {
          if (!map) return
          const points = map.queryRenderedFeatures(e.point, {
            layers: [POINT_LAYER_ID],
          })
          console.log('points', points)
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
            if (point.properties.id) {
              console.log('click set active')
              // click
              setActive(map, getProps(), internal.current, +point.id)
              return
            } else {
              console.warn('no features', e)
            }
          }
          const boundaries = map.queryRenderedFeatures(e.point, {
            layers: tiles.map((t) => `${t.name}.fill`),
          })
          const boundary = boundaries[0]
          if (boundary) {
            const bounds = bbox(boundary)
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

        const rgb = tagLenses[0].rgb
        map.addLayer({
          id: POINT_LAYER_ID,
          type: 'circle',
          source: RESTAURANTS_SOURCE_ID,
          paint: {
            'circle-radius': [
              'case',
              ['boolean', ['feature-state', 'hover'], false],
              8,
              6,
            ],

            'circle-stroke-width': {
              stops: [
                [8, 1],
                [11, 1],
                [16, 2],
              ],
            },

            'circle-stroke-color': `rgba(${rgb
              .map((x) => +x * 0.5)
              .join(',')}, 0.5)`,

            'circle-color': [
              'match',
              ['get', 'selected'],
              1,
              'yellow',
              0,
              `rgba(${rgb.join(',')}, 0.25)`,
              `rgba(${rgb.join(',')}, 0.25)`,
            ],

            // [
            //   'step',
            //   ['get', 'point_count'],
            //   15,
            //   20,
            //   20,
            //   50,
            //   25,
            //   100,
            //   30,
            // ],
          },
        })
        cancels.add(() => {
          map.removeLayer(POINT_LAYER_ID)
        })

        map.addLayer({
          id: POINT_HOVER_LAYER_ID,
          source: RESTAURANTS_UNCLUSTERED_SOURCE_ID,
          type: 'circle',
          filter: ['==', 'id', ''],
          paint: {
            'circle-radius': 8,
            'circle-color': blue,
            // 'icon-allow-overlap': true,
            // 'icon-ignore-placement': true,
            // 'icon-size': 0.25,
          },
        })
        cancels.add(() => {
          map.removeLayer(POINT_HOVER_LAYER_ID)
        })

        map.addLayer({
          id: UNCLUSTERED_LABEL_LAYER_ID,
          source: RESTAURANTS_SOURCE_ID,
          type: 'symbol',
          filter: ['!', ['has', 'point_count']],
          layout: {
            'icon-allow-overlap': true,
            'icon-ignore-placement': true,
            'text-field': ['format', ['get', 'title']],
            'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
            'text-size': 12,
            'text-variable-anchor': ['bottom', 'top', 'right', 'left'],
            // 'text-offset': [0, 2],
            'text-anchor': 'top',
          },
          paint: {
            'text-halo-color': '#fff',
            'text-halo-width': 1,
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
            // 'icon-allow-overlap': true,
            // 'icon-ignore-placement': true,
            'text-field': ['format', ['get', 'searchPosition']],
            'text-font': ['DIN Offc Pro Bold', 'Arial Unicode MS Bold'],
            'text-size': 13,
            // 'text-variable-anchor': ['bottom', 'top', 'right', 'left'],
            'text-anchor': 'center',
          },
          paint: {
            'text-color': '#000',
            // 'text-halo-color': '#70b600',
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

        type Event = mapboxgl.MapMouseEvent & {
          features?: mapboxgl.MapboxGeoJSONFeature[]
        } & mapboxgl.EventData
        type Listener = (ev: Event) => void

        let hoverId = null as null | number
        const setHovered = (e: Event, hover: boolean) => {
          if (!map) return
          map.getCanvas().style.cursor = hover ? 'pointer' : ''

          // only one at a time
          if (hoverId != null) {
            mapSetFeature(map, hoverId, { hover: false })
            hoverId = null
          }
          const id = e.features?.[0].id ?? -1
          if (id > -1 && hoverId != id) {
            if (hover) {
              hoverId = +id
              mapSetFeature(map, hoverId, { hover: true })
            }
          }
          const { features, onHover } = getProps()
          if (onHover) {
            if (id > -1) {
              const feature = features[+id]
              const rid = feature?.properties?.id
              if (rid) {
                onHover(rid)
              }
            } else {
              onHover(null)
            }
          }
        }

        const hoverCluster: Listener = (e) => {
          setHovered(e, true)
        }
        map.on('mouseenter', POINT_LAYER_ID, hoverCluster)
        cancels.add(() => {
          map.off('mouseenter', POINT_LAYER_ID, hoverCluster)
        })
        function unHoverCluster() {
          getProps().onHover(null)
          if (map) {
            map.getCanvas().style.cursor = ''
          }
        }
        map.on('mouseleave', POINT_LAYER_ID, unHoverCluster)
        cancels.add(() => {
          map.off('mouseleave', POINT_LAYER_ID, unHoverCluster)
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
        }, 20)

        const handleMoveEnd = () => {
          if (internal.current.isAwaitingNextMove) {
            return
          }
          handleMoveEndDebounced()
        }

        internal.current.currentMoveCancel = handleMoveEndDebounced.cancel

        const cancelMoveEnd = () => {
          handleMoveEndDebounced.cancel()
        }

        map.on('movestart', cancelMoveEnd)
        map.on('moveend', handleMoveEnd)
        cancels.add(() => {
          map.off('movestart', cancelMoveEnd)
          map.off('moveend', handleMoveEnd)
        })

        const handleMove: Listener = () => {
          handleMoveThrottled()
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
    if (mapNode) {
      mapNode.innerHTML = ''
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

  // console.log(
  //   'now span is',
  //   map.getBounds().toArray(),
  //   JSON.stringify(span, null, 2)
  // )

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
  return !sprite.includes(style.replace('mapbox://styles', ''))
}
