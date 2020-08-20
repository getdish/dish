import 'mapbox-gl/dist/mapbox-gl.css'

import { fullyIdle, series } from '@dish/async'
import { LngLat } from '@dish/graph'
import { useGet } from '@dish/ui'
import _, { isEqual } from 'lodash'
import mapboxgl from 'mapbox-gl'
import React, { useEffect, useRef, useState } from 'react'
import { Dimensions } from 'react-native'

import { MAPBOX_ACCESS_TOKEN } from '../constants'
import { dist } from '../state/home-location.helpers'

mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN

type MapPosition = { center: LngLat; span: LngLat }

type MapProps = {
  center?: LngLat
  span?: LngLat
  features: GeoJSON.Feature[]
  padding?: { top: number; left: number; bottom: number; right: number }
  mapRef?: (map: mapboxgl.Map) => void
  style?: string
  onSelect?: (id: string) => void
  onDoubleClick?: (id: string) => void
  onMoveEnd?: (props: MapPosition) => void
  selected?: string
  centerToResults?: number
}

const SOURCE_ID = 'restaurants'
const POINT_LAYER_ID = 'restaurants-points'
const PIN_LAYER_ID = 'restaurants-pins'
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
  const internal = useRef({ active: null, hasSetInitialSource: false })
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
      map.setLayoutProperty(POINT_LAYER_ID, 'symbol-sort-key', [
        'match',
        ['id'],
        internalId,
        -1,
        ['get', 'id'],
      ])
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
      style: style ?? 'mapbox://styles/nwienert/ck675hkw702mt1ikstagge6yq', // ??
      // dark
      //'mapbox://styles/nwienert/ck68dg2go01jb1it5j2xfsaja' ??
      center,
      zoom: 11,
    })
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
            loadMarker(
              'icon-sushi',
              require('../assets/icon-sushi.png').default
            ),
          ]),
        () => {
          map.addSource(SOURCE_ID, {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: props.features,
            },
            generateId: true,
          })

          map.addLayer({
            id: PIN_LAYER_ID,
            type: 'symbol',
            source: SOURCE_ID,
            layout: {
              'icon-image': 'map-pin',
              'icon-allow-overlap': true,
              'icon-size': 0.25,
              'icon-offset': [0, -10],
            },
          })

          // hover/point layer shared
          const layout: mapboxgl.SymbolLayout = {
            // 'icon-image': 'bar-15',
            'text-field': ['format', ['get', 'title'], { 'font-scale': 0.8 }],
            'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
            'text-offset': [0, 0.6],
            'text-anchor': 'top',
            // // @ts-ignore
            // 'text-halo-color': '#fff',
            // // @ts-ignore
            // 'text-halo-width': '1',
          }

          map.addLayer({
            id: POINT_LAYER_ID,
            type: 'symbol',
            source: SOURCE_ID,
            layout,
          })

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

          type Event = mapboxgl.MapMouseEvent & {
            features?: mapboxgl.MapboxGeoJSONFeature[]
          } & mapboxgl.EventData
          type Listener = (ev: Event) => void

          let hoverId = null
          const setHovered = (e: Event, hover: boolean) => {
            map.getCanvas().style.cursor = hover ? 'pointer' : ''

            // only one at a time
            if (hoverId != null) {
              // map.setLayoutProperty(POINT_LAYER_ID, 'icon-image', 'mountain-15')
              mapSetFeature(map, hoverId, { hover: false })
              hoverId = null
            }
            const id = e.features?.[0].id
            if (id > -1 && hoverId != id) {
              if (hover) {
                // map.setFilter(POINT_HOVER_LAYER_ID, ['==', 'id', id])
                mapSetIconSelected(map, id)
                // map.setLayoutProperty(POINT_LAYER_ID, 'icon-image', 'bar-15')
                hoverId = id
                mapSetFeature(map, hoverId, { hover: true })
              }
            }
          }

          const handleMouseMove: Listener = (e) => {
            handleMouseLeave(e)
            setHovered(e, true)
          }

          const handleMouseLeave: Listener = (e) => {
            setHovered(e, false)
          }

          const handleMouseClick: Listener = (e) => {
            setActive(map, +e.features[0].id)
          }

          /*
            Send back current location on move end
          */
          const getCurrentLocation = () => {
            const mapCenter = map.getCenter()
            const bounds = map.getBounds()
            const lat = round(dist(mapCenter.lat, bounds.getNorth()))
            const lng = round(dist(mapCenter.lng, bounds.getWest()))
            const center = {
              lng: round(mapCenter.lng),
              lat: round(mapCenter.lat),
            }
            return {
              center,
              span: {
                lng,
                lat,
              },
            }
          }

          let lastLoc = getCurrentLocation()
          const handleMoveEnd = _.debounce(() => {
            // ignore same location
            const next = getCurrentLocation()
            if (isEqual(lastLoc, next)) {
              return
            }
            lastLoc = next
            console.log(JSON.stringify({ next }, null, 2))
            props.onMoveEnd?.(next)
          }, 150)

          const handleMove: Listener = () => {
            handleMoveEnd.cancel()
          }

          const handleDoubleClick: Listener = (e) => {
            const id = e.features[0]?.id ?? -1
            const feature = features[+id]
            if (feature) {
              onDoubleClick?.(feature.properties.id)
            }
          }

          map.on('moveend', handleMoveEnd)
          map.on('move', handleMove)
          map.on('movestart', handleMove)
          map.on('click', PIN_LAYER_ID, handleMouseClick)
          map.on('dblclick', PIN_LAYER_ID, handleDoubleClick)
          map.on('mousemove', PIN_LAYER_ID, handleMouseMove)
          map.on('mouseleave', PIN_LAYER_ID, handleMouseLeave)

          cancels.add(() => {
            map.off('moveend', handleMoveEnd)
            map.off('move', handleMove)
            map.off('movestart', handleMove)
            map.off('click', PIN_LAYER_ID, handleMouseClick)
            map.off('dblclick', PIN_LAYER_ID, handleDoubleClick)
            map.off('mousemove', PIN_LAYER_ID, handleMouseMove)
            map.off('mouseleave', PIN_LAYER_ID, handleMouseLeave)
            map.removeLayer(PIN_LAYER_ID)
            map.removeLayer(POINT_LAYER_ID)
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
    const next = {
      ne: { lng: center.lng + span.lng, lat: center.lat + span.lat },
      sw: { lng: center.lng - span.lng, lat: center.lat - span.lat },
    }
    if (hasMovedAtLeast(map, next, 0.001)) {
      return series([
        () => fullyIdle({ min: 100 }),
        () => {
          const northEast = new mapboxgl.LngLat(next.ne.lng, next.ne.lat)
          const southWest = new mapboxgl.LngLat(next.sw.lng, next.sw.lat)
          map.fitBounds(new mapboxgl.LngLatBounds(southWest, northEast))
        },
      ])
    }
  }, [map, span.lat, span.lng, center.lat, center.lng])

  // padding
  useEffect(() => {
    if (!map) return
    map?.setPadding(padding)
  }, [map, JSON.stringify(padding)])

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
  const lastCenter = useRef(0)
  useEffect(() => {
    if (!map) return
    if (!features.length) return
    if (props.centerToResults <= 0) return
    if (props.centerToResults === lastCenter.current) return
    lastCenter.current = props.centerToResults
    const bounds = new mapboxgl.LngLatBounds()
    for (const feature of features) {
      const geo = feature.geometry
      if (geo.type === 'Point') {
        bounds.extend(geo.coordinates as any)
      }
    }
    map.fitBounds(bounds)
  }, [map, features, props.centerToResults])

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

const abs = (x: number) => Math.abs(x)
// TODO this is wrong redo using dist()
const totalDistance = (a: LngLat, b: LngLat) =>
  abs(a.lng) - abs(b.lng) + abs(a.lat) - abs(b.lat)

const hasMovedAtLeast = (
  map: mapboxgl.Map,
  next: { ne: LngLat; sw: LngLat },
  distance: number
) => {
  const bounds = map.getBounds()
  const cur = {
    ne: bounds.getNorthEast(),
    sw: bounds.getSouthWest(),
  }
  // only change them if they change more than a little bit
  return (
    abs(totalDistance(cur.ne, next.ne)) + abs(totalDistance(cur.ne, next.ne)) >
    distance
  )
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
//   id: POINT_LAYER_ID,
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
