import { HomeStateItemHome } from '../types/homeTypes'
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
