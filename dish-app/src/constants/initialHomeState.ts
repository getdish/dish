import { HomeStateItemHome } from '../app/state/home-types'
import { getDefaultLocation } from '../helpers/getDefaultLocation'

export const initialHomeState: HomeStateItemHome = {
  id: '0',
  type: 'home',
  activeTags: {},
  searchQuery: '',
  region: 'ca-san-francisco',
  ...getDefaultLocation(),
  section: '',
}
