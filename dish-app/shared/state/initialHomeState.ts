import { getDefaultLocation } from './getDefaultLocation'
import { HomeStateItemHome } from './home-types'
import { tagLenses } from './localTags.json'

export const initialHomeState: HomeStateItemHome = {
  id: '0',
  type: 'home',
  activeTags: {
    [tagLenses[0].slug]: true,
  },
  searchQuery: '',
  results: [],
  ...getDefaultLocation(),
}
