import { LngLat } from '@dish/graph'

export type AppMapPosition = {
  via: 'home' | 'click' | 'hover' | 'init' | 'results' | 'useSetAppMap'
  center: LngLat
  span: LngLat
  at: number
  id?: string
}

export type MapResultItem = {
  id: any
  slug: string
  name: string
  location: {
    coordinates: any[]
  }
}
