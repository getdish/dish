import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'

import {
  MapOptions,
  createPadding,
  propsToMapConstructionOptions,
} from './utils'

export const useMap = (opts: MapOptions = {}) => {
  const [defaultMapOptions] = React.useState(opts)
  let mapRef = useRef<HTMLDivElement>(null)
  let [map, setMap] = useState<mapkit.Map>()

  useEffect(() => {
    if (mapkit && mapRef.current) {
      const newMap = new mapkit.Map(
        mapRef.current,
        propsToMapConstructionOptions(defaultMapOptions)
      )
      setMap(newMap)
    }
  }, [mapRef, mapkit])

  useEffect(() => {
    if (map && opts.padding) {
      try {
        map.padding = createPadding(opts.padding)
      } catch (err) {
        console.error(err)
      }
    }
  }, [map, JSON.stringify(opts.padding ?? null)])

  // Clean up the map on unmount
  useLayoutEffect(() => {
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
  }
}
