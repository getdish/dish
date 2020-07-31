import { series } from '@dish/async'
import { LngLat } from '@dish/graph'
import mapboxgl from 'mapbox-gl'
import React, { memo, useEffect, useRef, useState } from 'react'

const marker = require('../assets/map-marker.png').default

mapboxgl.accessToken =
  'pk.eyJ1IjoibndpZW5lcnQiLCJhIjoiY2lvbWlhYjRjMDA0NnVpbTIxMHM5ZW95eCJ9.DQyBjCEuPRVt1400yejGhA'

type MapProps = {
  center?: LngLat
  span?: LngLat
  features?: GeoJSON.Feature[]
  padding?: { top: number; left: number; bottom: number; right: number }
  mapRef?: (map: mapboxgl.Map) => void
}

export const Map = ({ center, span, padding, features, mapRef }: MapProps) => {
  const mapNode = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<mapboxgl.Map | null>(null)

  useEffect(() => {
    const mapboxMap = new mapboxgl.Map({
      container: mapNode.current,
      style: 'mapbox://styles/nwienert/ck675hkw702mt1ikstagge6yq',
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

  // center
  useEffect(() => {
    if (!map) return
    map?.setCenter(center)
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
    map.addSource('points', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features,
      },
    })

    map.addLayer({
      id: 'points',
      type: 'symbol',
      source: 'points',
      layout: {
        'icon-image': 'custom-marker',
        'icon-size': 0.5,
        // get the title name from the source's "title" property
        'text-field': ['get', 'title'],
        'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
        'text-offset': [0, 1.25],
        'text-anchor': 'top',
      },
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
    })

    return () => {
      map.removeLayer('points')
      map.removeSource('points')
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
