import { getDefaultLocation } from '../helpers/getDefaultLocation'
import { HomeStateItemHome } from '../app/state/home-types'

export const initialHomeState: HomeStateItemHome = {
  id: '0',
  type: 'home',
  activeTags: {},
  searchQuery: '',
  ...getDefaultLocation(),
  region: 'ca-san-francisco',
  section: '',
}
