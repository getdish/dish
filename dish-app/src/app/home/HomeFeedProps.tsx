import { MapPosition } from '@dish/graph'

import { HomeStateItemHome, RegionNormalized } from '../../types/homeTypes'
import { HomeStackViewProps } from './HomeStackViewProps'

export type HomeFeedProps = HomeStackViewProps<HomeStateItemHome> & {
  region?: RegionNormalized | null
  item: HomeStateItemHome
} & MapPosition
