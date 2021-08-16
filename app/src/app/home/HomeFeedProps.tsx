import { MapPosition } from '@dish/graph'

import { HomeStateItemHome, RegionNormalized } from '../../types/homeTypes'
import { HomeStackViewProps } from './HomeStackViewProps'

type HomeProps = HomeStackViewProps<HomeStateItemHome>

export type HomeFeedProps = Pick<HomeProps, 'item'> & {
  isActive?: boolean
  regionName?: string
  region?: RegionNormalized | null
} & MapPosition
