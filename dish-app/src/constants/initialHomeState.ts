import { getDefaultLocation } from '../helpers/getDefaultLocation'
import { HomeStateItemHome } from '../types/homeTypes'

export const initialHomeState: HomeStateItemHome = {
  id: '0',
  type: 'home',
  activeTags: {},
  searchQuery: '',
  region: 'ca-san-francisco',
  ...getDefaultLocation(),
  section: '',
}
