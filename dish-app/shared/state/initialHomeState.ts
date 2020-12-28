import { getDefaultLocation } from './getDefaultLocation'
import { HomeStateItemHome } from './home-types'

export const initialHomeState: HomeStateItemHome = {
  id: '0',
  type: 'home',
  activeTags: {},
  searchQuery: '',
  ...getDefaultLocation(),
  region: 'ca-san-francisco',
  section: '',
}
