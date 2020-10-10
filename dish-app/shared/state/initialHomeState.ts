import { getDefaultLocation } from './getDefaultLocation'
import { getTagId } from './getTagId'
import { HomeStateItemHome } from './home-types'
import { tagLenses } from './tagLenses'

export const initialHomeState: HomeStateItemHome = {
  id: '0',
  type: 'home',
  activeTagIds: {},
  searchQuery: '',
  results: [],
  ...getDefaultLocation(),
}
