import { LngLat } from '@dish/graph'

export type AppMapPosition = {
  via: 'home' | 'click' | 'hover' | 'init'
  center: LngLat
  span: LngLat
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
