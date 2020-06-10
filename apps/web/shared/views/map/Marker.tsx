import React, { useContext, useEffect, useRef } from 'react'

import { MapContext } from './Map'
import {
  MarkerOptions,
  createCoordinate,
  propsToMarkerConstructionOptions,
} from './utils'

type MarkerProps = {
  latitude: number
  longitude: number
} & MarkerOptions

export const Marker: React.FC<MarkerProps> = ({
  latitude,
  longitude,
  ...options
}) => {
  const { mapkit, map } = useContext(MapContext)
  const marker = useRef<mapkit.MarkerAnnotation>()

  useEffect(() => {
    if (mapkit && map) {
      marker.current = new mapkit.MarkerAnnotation(
        createCoordinate(latitude, longitude),
        propsToMarkerConstructionOptions(options)
      )

      map.addAnnotation(marker.current)
    }
  }, [mapkit, map])

  return null
}
