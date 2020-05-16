import React, { useMemo } from 'react'

import { useMap } from './useMap'
import { MapOptions } from './utils'

type MapRef = React.RefObject<HTMLDivElement>

type MapContextType = {
  map?: mapkit.Map
  mapkit?: typeof mapkit
}

export const MapContext = React.createContext({
  map: undefined,
  mapkit: undefined,
} as MapContextType)

const MapProvider: React.FC<{ context: MapContextType }> = ({
  children,
  context,
}) => {
  return <MapContext.Provider value={context} children={children} />
}

// this component is the parent to the mapkit generated map components
const MapContainer: React.FC<{ mapRef: MapRef }> = ({ children, mapRef }) => {
  return (
    <div
      ref={mapRef}
      style={{ width: '100%', height: '100%' }}
      children={children}
    />
  )
}

const CreateMap: React.FC<MapOptions> = ({ children, ...defaultOptions }) => {
  const {
    mapProps: { mapkit, map, mapRef },
  } = useMap(defaultOptions)
  return (
    <MapProvider context={useMemo(() => ({ mapkit, map }), [mapkit, map])}>
      <MapContainer mapRef={mapRef} children={children} />
    </MapProvider>
  )
}

export const Map: React.FC<{
  // ⚠️ Pick between callbackUrl or token.
  // https://developer.apple.com/documentation/mapkitjs/mapkit/2974045-init
  // not needed if within a `MapProvider`
  tokenOrCallback?: string
  mapRef?: MapRef
  mapkit?: typeof mapkit
  map?: mapkit.Map
} & MapOptions> = ({ tokenOrCallback, mapkit, map, mapRef, ...props }) => {
  // map has already been created, we just need to setup the provider
  if (mapRef) {
    return (
      <MapProvider context={{ mapkit, map }}>
        <MapContainer mapRef={mapRef} {...props} />
      </MapProvider>
    )
  }

  return <CreateMap {...props} />
}
