import 'mapbox-gl/dist/mapbox-gl.css'

import { fullyIdle, series } from '@dish/async'
import { LngLat } from '@dish/graph'
import { useGet } from '@dish/ui'
import _, { isEqual } from 'lodash'
import mapboxgl from 'mapbox-gl'
import React, { useEffect, useRef, useState } from 'react'
import { Dimensions } from 'react-native'

import { MAPBOX_ACCESS_TOKEN } from '../constants'
import { rgbString } from '../helpers/rgbString'
import { tagLenses } from '../state/tagLenses'

mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN

type MapPosition = { center: LngLat; span: LngLat }

type MapProps = {
  center?: LngLat
  span?: LngLat
  features: GeoJSON.Feature[]
  padding?: { top: number; left: number; bottom: number; right: number }
  mapRef?: (map: mapboxgl.Map) => void
  style?: string
  onHover?: (id: string | null) => void
  onSelect?: (id: string) => void
  onDoubleClick?: (id: string) => void
  onMoveEnd?: (props: MapPosition) => void
  selected?: string
  centerToResults?: number
}

const SOURCE_ID = 'restaurants'
const LAYER_POINTS = 'restaurants-points'
const PIN_LAYER_ID = 'restaurants-pins'
const UNCLUSTERED_LABEL_LAYER_ID = 'UNCLUSTERED_LABEL_LAYER_ID'
const CLUSTER_LABEL_LAYER_ID = 'CLUSTER_LABEL_LAYER_ID'
const POINT_LAYER_ID = 'POINT_LAYER_ID'
const POINT_HOVER_LAYER_ID = 'restaurants-points-hover'

const round = (val: number, dec = 100000) => {
  return Math.round(val * dec) / dec
}

const mapSetFeature = (map: mapboxgl.Map, id: any, obj: any) => {
  map.setFeatureState(
    {
      source: SOURCE_ID,
      id,
    },
    obj
  )
}

const mapSetIconSelected = (map: mapboxgl.Map, id: any) => {
  // map.setLayoutProperty(PIN_LAYER_ID, 'icon-image', [
  //   'match',
  //   ['id'],
  //   id,
  //   'map-pin',
  //   'icon-sushi',
  // ])
  // map.setLayoutProperty(PIN_LAYER_ID, 'icon-size', [
  //   'match',
  //   ['id'],
  //   id,
  //   0.5,
  //   0.5,
  // ])
}

export const Map = (props: MapProps) => {
  const mapNode = useRef<HTMLDivElement>(null)
  let [map, setMap] = useState<mapboxgl.Map | null>(null)
  const internal = useRef({
    active: null,
    hasSetInitialSource: false,
  })
  const getProps = useGet(props)

  // this is inside memo...
  const setActive = (map: mapboxgl.Map, internalId: number) => {
    const { onSelect, features } = getProps()
    if (!features.length) return
    const cur = internal.current.active
    if (cur != null) {
      mapSetFeature(map, internalId, { active: false })
    }
    if (internalId > -1) {
      internal.current.active = internalId
      mapSetFeature(map, internalId, { active: true })
      // map.setFilter(POINT_HOVER_LAYER_ID, ['==', 'id', internalId])
      // map.setLayoutProperty(POINT_LAYER_ID, 'symbol-sort-key', [
      //   'match',
      //   ['id'],
      //   internalId,
      //   -1,
      //   ['get', 'id'],
      // ])
      const feature = features[+internalId]
      if (feature) {
        onSelect?.(feature.properties.id)
      }
    }
  }

  // window resize
  useEffect(() => {
    if (!map) return
    const handleResize = _.debounce(() => {
      map.resize()
    }, 300)
    Dimensions.addEventListener('change', handleResize)
    return () => {
      handleResize.cancel()
      Dimensions.removeEventListener('change', handleResize)
    }
  }, [map])

  useEffect(() => {
    if (!mapNode.current) return

    map = new mapboxgl.Map({
      container: mapNode.current,
      style: style ?? 'mapbox://styles/nwienert/ckddrrcg14e4y1ipj0l4kf1xy',
      // 'mapbox://styles/nwienert/cke43ku0a0snr19njwnpg2lhi', // frank
      // 'mapbox://styles/nwienert/ck68dg2go01jb1it5j2xfsaja', // dark
      // 'mapbox://styles/nwienert/ck675hkw702mt1ikstagge6yq', // light
      center,
      zoom: 11,
      attributionControl: false,
    })
      .setPadding(padding)
      .addControl(
        new mapboxgl.AttributionControl({
          compact: true,
        })
      )
    window['map'] = map

    const loadMarker = (name: string, asset: string) =>
      new Promise((res, rej) => {
        map.loadImage(asset, (err, image) => {
          if (err) return rej(err)
          if (!map.hasImage(name)) {
            map.addImage(name, image)
          }
          res(image)
        })
      })

    const loadMap = () =>
      new Promise((res) => {
        map.on('load', res)
      })

    const cancels = new Set<Function>()

    cancels.add(
      series([
        () =>
          Promise.all([
            loadMap(),
            loadMarker('map-pin', require('../assets/map-pin.png').default),
            // loadMarker(
            //   'icon-sushi',
            //   require('../assets/icon-sushi.png').default
            // ),
          ]),
        () => {
          map.addSource(SOURCE_ID, {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: props.features,
            },
            generateId: true,

            // clustering
            cluster: true,
            clusterMaxZoom: 14,
            clusterRadius: 18,
          })

          const [r, g, b] = tagLenses[0].rgb
          map.addLayer({
            id: POINT_LAYER_ID,
            type: 'circle',
            source: SOURCE_ID,
            layout: {
              // 'icon-image': 'map-pin',
              // 'icon-allow-overlap': true,
              // 'icon-size': 0.25,
              // 'icon-offset': [0, -10],
            },
            paint: {
              // make circles larger as the user zooms from z12 to z22
              'circle-radius': [
                'step',
                ['get', 'point_count'],
                15,
                200,
                30,
                750,
                40,
              ],
              'circle-color': `rgba(${r},${g},${b}, 0.5)`,
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
            },
          })
          cancels.add(() => {
            map.removeLayer(POINT_LAYER_ID)
          })

          map.addLayer({
            id: UNCLUSTERED_LABEL_LAYER_ID,
            source: SOURCE_ID,
            type: 'symbol',
            filter: ['!', ['has', 'point_count']],
            layout: {
              'text-field': ['format', ['get', 'title']],
              'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
              'text-size': 12,
              'text-offset': [0, 0.75],
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
            id: CLUSTER_LABEL_LAYER_ID,
            type: 'symbol',
            source: SOURCE_ID,
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

          let hoverId = null
          const setHovered = (e: Event, hover: boolean) => {
            map.getCanvas().style.cursor = hover ? 'pointer' : ''

            // only one at a time
            if (hoverId != null) {
              // map.setLayoutProperty(UNCLUSTE, 'icon-image', 'mountain-15')
              mapSetFeature(map, hoverId, { hover: false })
              hoverId = null
            }
            const id = e.features?.[0].id
            if (id > -1 && hoverId != id) {
              if (hover) {
                // map.setFilter(POINT_HOVER_LAYER_ID, ['==', 'id', id])
                mapSetIconSelected(map, id)
                // map.setLayoutProperty(UNCLUSTE, 'icon-image', 'bar-15')
                hoverId = id
                mapSetFeature(map, hoverId, { hover: true })
              }
            }
            const { features, onHover } = getProps()
            if (onHover) {
              if (id > -1) {
                const feature = features[+id]
                const rid = feature?.properties.id
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
            map.getCanvas().style.cursor = ''
          }
          map.on('mouseleave', POINT_LAYER_ID, unHoverCluster)
          cancels.add(() => {
            map.off('mouseleave', POINT_LAYER_ID, unHoverCluster)
          })

          // const handleMouseMove: Listener = (e) => {
          //   handleMouseLeave(e)
          //   setHovered(e, true)
          // }

          const handleMouseLeave: Listener = (e) => {
            setHovered(e, false)
          }

          /*
            Send back current location on move end
          */
          let lastLoc = getCurrentLocation(map)
          const handleMoveEnd = _.debounce(() => {
            // ignore same location
            const next = getCurrentLocation(map)
            if (isEqual(lastLoc, next)) {
              return
            }
            // console.log(
            //   'handleMoveEnd, currentLocation',
            //   JSON.stringify(next, null, 2)
            // )
            lastLoc = next
            props.onMoveEnd?.(next)
          }, 150)

          map.on('moveend', handleMoveEnd)
          cancels.add(() => {
            map.off('moveend', handleMoveEnd)
          })

          const handleMove: Listener = () => {
            handleMoveEnd.cancel()
          }
          map.on('move', handleMove)
          map.on('movestart', handleMove)
          cancels.add(() => {
            map.off('move', handleMove)
            map.off('movestart', handleMove)
          })

          const handleDoubleClick: Listener = (e) => {
            console.log('double clicking', e.features[0]?.id)
            const id = e.features[0]?.id ?? -1
            const feature = features[+id]
            if (feature) {
              onDoubleClick?.(feature.properties.id)
            }
          }
          map.on('dblclick', CLUSTER_LABEL_LAYER_ID, handleDoubleClick)
          cancels.add(() => {
            map.off('dblclick', CLUSTER_LABEL_LAYER_ID, handleDoubleClick)
          })

          const handleClick = (e) => {
            const features = map.queryRenderedFeatures(e.point, {
              layers: [POINT_LAYER_ID],
            })
            const clusterId = features[0].properties.cluster_id
            if (clusterId) {
              const source = map.getSource(SOURCE_ID)
              if (source.type === 'geojson') {
                source.getClusterExpansionZoom(clusterId, function (err, zoom) {
                  if (err) return
                  map.easeTo({
                    center: features[0].geometry['coordinates'],
                    zoom: zoom * 1.1,
                  })
                })
              }
            } else {
              // click
              setActive(map, +e.features[0].id)
            }
          }
          map.on('click', CLUSTER_LABEL_LAYER_ID, handleClick)
          map.on('click', POINT_LAYER_ID, handleClick)
          cancels.add(() => {
            map.off('click', CLUSTER_LABEL_LAYER_ID, handleClick)
            map.off('click', POINT_LAYER_ID, handleClick)
          })

          // map.on('mousemove', PIN_LAYER_ID, handleMouseMove)
          // map.on('mouseleave', PIN_LAYER_ID, handleMouseLeave)
          cancels.add(() => {
            // map.off('mousemove', PIN_LAYER_ID, handleMouseMove)
            // map.off('mouseleave', PIN_LAYER_ID, handleMouseLeave)
            // map.removeLayer(PIN_LAYER_ID)
            // map.removeLayer(POINT_HOVER_LAYER_ID)
          })
        },
        () => {
          map.resize()
          setMap(map)
          props.mapRef?.(map)
        },
      ])
    )

    return () => {
      cancels.forEach((c) => c())
      mapNode.current.innerHTML = ''
    }
  }, [])

  const {
    center,
    span,
    padding,
    features,
    style,
    selected,
    onDoubleClick,
  } = props

  // selected
  useEffect(() => {
    const isMapLoaded = map && map.isStyleLoaded()
    if (!isMapLoaded) return
    if (!selected) return
    const index = features.findIndex((x) => x.properties.id === selected)
    mapSetIconSelected(map, index)
    setActive(map, index)
  }, [map, features, selected])

  // style
  useEffect(() => {
    if (!map || !style) return
    map.setStyle(style)
  }, [map, style])

  // center + span
  useEffect(() => {
    if (!map) return
    // west, south, east, north
    const next: [number, number, number, number] = [
      center.lng - span.lng,
      center.lat - span.lat,
      center.lng + span.lng,
      center.lat + span.lat,
    ]

    // show center/sw/ne points on map for debugging
    if (false ?? window['debug']) {
      const source = map.getSource(SOURCE_ID)
      if (source?.type === 'geojson') {
        source.setData({
          type: 'FeatureCollection',
          features: [
            ...features,
            // debug: add the sw, ne points
            {
              type: 'Feature',
              id: Math.random(),
              geometry: {
                type: 'Point',
                coordinates: [center.lng, center.lat],
              },
              properties: {
                color: 'orange',
              },
            },
            {
              type: 'Feature',
              id: Math.random(),
              geometry: {
                type: 'Point',
                coordinates: [next[0], next[1]],
              },
              properties: {
                color: 'blue',
              },
            },
            {
              type: 'Feature',
              id: Math.random(),
              geometry: {
                type: 'Point',
                coordinates: [next[2], next[3]],
              },
              properties: {
                color: 'blue',
              },
            },
          ],
        })
      }
    }

    // console.warn(
    //   'NOW\n',
    //   JSON.stringify({ center, span }, null, 2),
    //   '\n',
    //   `map.fitBounds([${next}])`
    // )

    if (hasMovedAtLeast(map, { center, span }, 0.01)) {
      return series([
        () => fullyIdle({ max: 350 }),
        () => {
          map.fitBounds(next)
        },
      ])
    }
  }, [map, span.lat, span.lng, center.lat, center.lng])

  // padding
  useEffect(() => {
    if (!map) return
    map?.setPadding(padding)
  }, [map, JSON.stringify(padding)])

  // console.log('padding', padding)

  // features
  useEffect(() => {
    if (!map) return
    const source = map.getSource(SOURCE_ID)
    if (source?.type === 'geojson') {
      source.setData({
        type: 'FeatureCollection',
        features,
      })
    }
  }, [features, map])

  // centerToResults
  // const lastCenter = useRef(0)
  // useEffect(() => {
  //   if (!map) return
  //   if (!features.length) return
  //   if (props.centerToResults <= 0) return
  //   if (props.centerToResults === lastCenter.current) return
  //   lastCenter.current = props.centerToResults
  //   const bounds = new mapboxgl.LngLatBounds()
  //   for (const feature of features) {
  //     const geo = feature.geometry
  //     if (geo.type === 'Point') {
  //       bounds.extend(geo.coordinates as any)
  //     }
  //   }
  //   map.fitBounds(bounds)
  // }, [map, features, props.centerToResults])

  return (
    <div
      ref={mapNode}
      style={{
        width: '100%',
        height: '100%',
        maxHeight: '100%',
        maxWidth: '100%',
        overflow: 'hidden',
        background: '#CAEAF8', // water bg color
      }}
    />
  )
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

const abs = (x: number) => Math.abs(x)

const hasMovedAtLeast = (
  map: mapboxgl.Map,
  next: { center: LngLat; span: LngLat },
  distance: number
) => {
  const current = getCurrentLocation(map)
  const d1 = abs(next.center.lng - current.center.lng)
  const d2 = abs(next.center.lat - current.center.lat)
  const d3 = abs(next.span.lat - current.span.lat)
  const d4 = abs(next.span.lng - current.span.lng)
  const diff = d1 + d2 + d3 + d4
  return diff > distance
}

///

// paint: {
//   'icon-translate': [100, 2],
// },
// paint: {
//   'circle-opacity': 0.4,
//   'circle-color': '#830300',
//   'circle-stroke-width': 2,
//   'circle-stroke-color': '#fff',
// },
// "circ"
//   "circle-radius": {
//         "property": "mag",
//         "base": 2.5,
//         "stops": [
//             [{zoom: 0,  value: 2}, 1],
//             [{zoom: 0,  value: 8}, 40],
//             [{zoom: 11, value: 2}, 10],
//             [{zoom: 11, value: 8}, 2400],
//             [{zoom: 20, value: 2}, 20],
//             [{zoom: 20, value: 8}, 6000]
//           "circle-radius-transition": {
//     "duration": 0
//   }
//         ]
//     }
// }
// map.addLayer({
//   id: UNCLUSTE,
//   type: 'circle',
//   source: SOURCE_ID,

//   paint: {
//     // The feature-state dependent circle-radius expression will render
//     // the radius size according to its magnitude when
//     // a feature's hover state is set to true
//     'circle-radius': [
//       'case',
//       ['boolean', ['feature-state', 'hover'], false],
//       5,
//       3,
//     ],
//     'circle-stroke-color': '#fff',
//     'circle-stroke-width': 1,
//     // The feature-state dependent circle-color expression will render
//     // the color according to its magnitude when
//     // a feature's hover state is set to true
//     'circle-color': [
//       'case',
//       ['boolean', ['feature-state', 'active'], false],
//       '#000',
//       '#888',
//     ],
//   },

//   // paint: {
//   //   'icon-translate': [100, 2],
//   // },
//   // paint: {
//   //   'circle-opacity': 0.4,
//   //   'circle-color': '#830300',
//   //   'circle-stroke-width': 2,
//   //   'circle-stroke-color': '#fff',
//   // },
//   // "circ"
//   //   "circle-radius": {
//   //         "property": "mag",
//   //         "base": 2.5,
//   //         "stops": [
//   //             [{zoom: 0,  value: 2}, 1],
//   //             [{zoom: 0,  value: 8}, 40],
//   //             [{zoom: 11, value: 2}, 10],
//   //             [{zoom: 11, value: 8}, 2400],
//   //             [{zoom: 20, value: 2}, 20],
//   //             [{zoom: 20, value: 8}, 6000]
//   //           "circle-radius-transition": {
//   //     "duration": 0
//   //   }
//   //         ]
//   //     }
//   // }
// })

// '\n',
// {},
// ['downcase', ['get', 'subtitle']],
// { 'font-scale': 0.6 },

// hover/point layer shared
// const layout: mapboxgl.SymbolLayout = {
//   // 'icon-image': 'bar-15',
//   'text-field': ['format', ['get', 'title'], { 'font-scale': 0.8 }],
//   'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
//   'text-offset': [0, 0.6],
//   'text-anchor': 'top',
//   // // @ts-ignore
//   // 'text-halo-color': '#fff',
//   // // @ts-ignore
//   // 'text-halo-width': '1',
// }

// map.addLayer({
//   id: UNCLUSTE,
//   type: 'symbol',
//   source: SOURCE_ID,
//   layout,
// })

// map.addLayer({
//   id: POINT_HOVER_LAYER_ID,
//   type: 'symbol',
//   source: SOURCE_ID,
//   filter: ['==', 'id', ''],
//   layout: {
//     ...layout,
//     'icon-size': 0.5,
//     'icon-offset': [0, -15],
//   },
// })
