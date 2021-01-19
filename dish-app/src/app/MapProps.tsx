import { LngLat } from '@dish/graph'
import mapboxgl from 'mapbox-gl'

import { Region } from '../types/homeTypes'

export type MapProps = {
  center: LngLat
  span: LngLat
  features: GeoJSON.Feature[]
  padding?: { top: number; left: number; bottom: number; right: number }
  mapRef?: (map: mapboxgl.Map) => void
  style?: string
  onHover?: (id: string | null) => void
  onSelect?: (id: string) => void
  onSelectRegion?: (region: Region) => void
  onDoubleClick?: (id: string) => void
  onMoveEnd?: (props: MapPosition) => void
  selected?: string
  hovered?: string
  centerToResults?: number
  showRank?: boolean
  zoomOnHover?: boolean
}

type MapPosition = { center: LngLat; span: LngLat }
