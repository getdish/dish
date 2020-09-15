import { LngLat } from '@dish/graph'
import mapboxgl from 'mapbox-gl'

export type MapProps = {
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
  hovered?: string
  centerToResults?: number
}

type MapPosition = { center: LngLat; span: LngLat }
