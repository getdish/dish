import { RegionNormalized } from '../helpers/fetchRegion'
import { HomeStateItem } from './home-types'

export type HomeStateItemLocation = {
  center: HomeStateItem['center']
  span: HomeStateItem['span']
  region?: RegionNormalized
}
