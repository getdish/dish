import { LngLat } from '@dish/graph'

import { MapRegionEvent } from '../types/homeTypes'

export type MapProps = {
  center: LngLat
  span: LngLat
  features: GeoJSON.Feature[]
  padding: { top: number; left: number; bottom: number; right: number }
  showUserLocation?: boolean
  mapRef?: (map: any) => void
  style?: string
  onHover?: (id: string | null) => void
  onSelect?: (id: string) => void
  onSelectRegion?: (region: MapRegionEvent) => void
  tileId?: string
  onDoubleClick?: (id: string) => void
  onMoveEnd?: (props: MapPosition) => void
  onMoveStart?: () => void
  selected?: string
  hovered?: string
  centerToResults?: number
  showRank?: boolean
  zoomOnHover?: boolean
  hideRegions?: boolean
}

type MapPosition = { center: LngLat; span: LngLat }
