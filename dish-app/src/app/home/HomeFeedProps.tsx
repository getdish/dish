import { MapPosition } from '@dish/graph'

import { HomeStateItemHome, RegionNormalized } from '../../types/homeTypes'
import { HomeStackViewProps } from './HomeStackViewProps'

type HomeProps = HomeStackViewProps<HomeStateItemHome>

export type HomeFeedProps = Partial<HomeProps> & {
  isActive: HomeProps['isActive']
  regionName?: string
  region?: RegionNormalized | null
  item: HomeStateItemHome
} & MapPosition
