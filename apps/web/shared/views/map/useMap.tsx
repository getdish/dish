import React from 'react'

// import { mapkit } from '../mapkit'
import { MapOptions, propsToMapConstructionOptions } from './utils'
import {
  NumberTuple,
  Rect,
  RegionType,
  createCoordinate,
  createCoordinateRegionFromValues,
  createMapRect,
} from './utils'

export const useMap = (defaultOptions: MapOptions = {}) => {
  const [defaultMapOptions] = React.useState(defaultOptions)
  let mapRef = React.useRef<HTMLDivElement>(null)
  let [map, setMap] = React.useState<mapkit.Map>()

  React.useEffect(() => {
    if (mapkit && mapRef.current) {
      const newMap = new mapkit.Map(
        mapRef.current,
        propsToMapConstructionOptions(defaultMapOptions)
      )
      setMap(newMap)
    }
  }, [mapRef, mapkit])

  // Clean up the map on unmount
  React.useEffect(() => {
    return () => {
      if (!map) return
      try {
        map.destroy()
      } catch (err) {
        console.log('err disposing map, hmr issue')
      }
    }
  }, [map])

  return {
    mapkit,
    map,
    mapProps: {
      mapkit,
      map,
      mapRef,
    },
    // setVisibleMapRect: React.useCallback(
    //   (visibleMapRect: Rect, isAnimated: boolean = false) => {
    //     if (map) {
    //       map.setVisibleMapRectAnimated(
    //         createMapRect(...visibleMapRect),
    //         isAnimated
    //       )
    //     }
    //   },
    //   [map]
    // ),
  }
}
