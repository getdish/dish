import { series } from '@dish/async'
import { LngLat } from '@dish/graph'
import mapboxgl from 'mapbox-gl'
import React, { useEffect, useRef, useState } from 'react'

const marker = require('../assets/map-marker.png').default

mapboxgl.accessToken =
  'pk.eyJ1IjoibndpZW5lcnQiLCJhIjoiY2lvbWlhYjRjMDA0NnVpbTIxMHM5ZW95eCJ9.DQyBjCEuPRVt1400yejGhA'

type MapProps = {
  center?: LngLat
  span?: LngLat
  features?: GeoJSON.Feature[]
  padding?: { top: number; left: number; bottom: number; right: number }
  mapRef?: (map: mapboxgl.Map) => void
  style?: string
  onSelect?: (id: string) => void
  selected?: string
}

const SOURCE_ID = 'restaurants'
const POINT_LAYER_ID = 'restaurants-points'
const POINT_HOVER_LAYER_ID = 'restaurants-points-hover'

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
  map.setLayoutProperty(POINT_LAYER_ID, 'icon-image', [
    'match',
    ['id'],
    id,
    'mountain-15',
    'bar-15',
  ])
}

export const Map = ({
  center,
  span,
  padding,
  features,
  style,
  mapRef,
  selected,
  onSelect,
}: MapProps) => {
  const mapNode = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<mapboxgl.Map | null>(null)
  const internal = useRef({ active: null })

  const setActive = (internalId: number) => {
    const cur = internal.current.active
    if (cur != null) {
      mapSetFeature(map, internalId, { active: false })
    }
    if (internalId > -1) {
      internal.current.active = internalId
      mapSetFeature(map, internalId, { active: true })

      map.setFilter(POINT_HOVER_LAYER_ID, ['==', 'id', internalId])

      map.setLayoutProperty(POINT_LAYER_ID, 'symbol-sort-key', [
        'match',
        ['id'],
        internalId,
        -1,
        ['get', 'id'],
      ])
      // internalId, {
      //   : -100,
      // })

      const feature = features[+internalId]
      if (feature) {
        onSelect?.(feature.properties.id)
      }
    }
  }

  useEffect(() => {
    if (!map) return
    if (!selected) return
    const index = features.findIndex((x) => x.properties.id === selected)
    mapSetIconSelected(map, index)
    setActive(index)
  }, [map, features, selected])

  useEffect(() => {
    if (!mapNode.current) return

    const mapboxMap = new mapboxgl.Map({
      container: mapNode.current,
      style: style ?? 'mapbox://styles/nwienert/ck675hkw702mt1ikstagge6yq', // ??
      // dark
      //'mapbox://styles/nwienert/ck68dg2go01jb1it5j2xfsaja' ??
      center,
      zoom: 11,
    })

    const loadMarker = () =>
      new Promise((res, rej) => {
        mapboxMap.loadImage(marker, (err, image) => {
          if (err) return rej(err)
          if (!mapboxMap.hasImage('custom-marker')) {
            mapboxMap.addImage('custom-marker', image)
          }
          res(image)
        })
      })
    const loadMap = () =>
      new Promise((res) => {
        mapboxMap.on('load', res)
      })

    const dispose = series([
      loadMap,
      loadMarker,
      () => {
        mapboxMap.resize()
        setMap(mapboxMap)
        mapRef?.(mapboxMap)
      },
    ])

    return () => {
      dispose()
      mapNode.current.innerHTML = ''
    }
  }, [])

  useEffect(() => {
    if (!map || !style) return
    map.setStyle(style)
  }, [map, style])

  // center
  useEffect(() => {
    if (!map) return
    map?.flyTo({
      center,
      speed: 0.5,
    })
  }, [map, center.lng, center.lat])

  // span
  useEffect(() => {
    if (!map) return
    const clng = center.lng
    const clat = center.lat
    map?.fitBounds([
      [clng + span.lng, clat - span.lat],
      [clng - span.lng, clat + span.lat],
    ])
  }, [map, JSON.stringify(span)])

  // // padding
  useEffect(() => {
    if (!map) return
    map?.setPadding(padding)
  }, [map, JSON.stringify(padding)])

  // markers
  useEffect(() => {
    if (!map) return
    if (!features.length) return

    map.addSource(SOURCE_ID, {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features,
      },
      generateId: true,
    })

    const layout: mapboxgl.AnyLayout = {
      'icon-image': 'bar-15',
      'text-field': ['format', ['get', 'title'], { 'font-scale': 0.8 }],
      'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
      'text-offset': [0, 0.6],
      'text-anchor': 'top',
    }

    map.addLayer({
      id: POINT_LAYER_ID,
      type: 'symbol',
      source: SOURCE_ID,
      layout,
    })

    map.addLayer({
      id: POINT_HOVER_LAYER_ID,
      type: 'symbol',
      source: SOURCE_ID,
      filter: ['==', 'id', ''],
      layout: {
        ...layout,
        'icon-image': 'heart-15',
      },
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
        // map.setLayoutProperty(POINT_LAYER_ID, 'icon-image', 'mountain-15')
        mapSetFeature(map, hoverId, { hover: false })
        hoverId = null
      }
      if (hover) {
        const id = e.features[0].id
        console.log('filter to show', id)
        console.log('map', id, map)
        // map.setFilter(POINT_HOVER_LAYER_ID, ['==', 'id', id])
        mapSetIconSelected(map, id)
        // map.setLayoutProperty(POINT_LAYER_ID, 'icon-image', 'bar-15')
        hoverId = id
        mapSetFeature(map, hoverId, { hover: true })
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
      setActive(+e.features[0].id)
    }

    map.on('click', POINT_LAYER_ID, handleMouseClick)
    map.on('mousemove', POINT_LAYER_ID, handleMouseMove)
    map.on('mouseleave', POINT_LAYER_ID, handleMouseLeave)

    return () => {
      map.off('click', POINT_LAYER_ID, handleMouseClick)
      map.off('mousemove', POINT_LAYER_ID, handleMouseMove)
      map.off('mouseleave', POINT_LAYER_ID, handleMouseLeave)
      map.removeLayer(POINT_LAYER_ID)
      map.removeLayer(POINT_HOVER_LAYER_ID)
      map.removeSource(SOURCE_ID)
    }
  }, [map, features])

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
