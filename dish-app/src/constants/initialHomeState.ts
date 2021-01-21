import { getDefaultLocation } from '../helpers/getDefaultLocation'
import { HomeStateItemHome } from '../types/homeTypes'

const dl = getDefaultLocation()

export const initialHomeState: HomeStateItemHome = {
  id: '0',
  type: 'home',
  activeTags: {},
  searchQuery: '',
  center: dl.center,
  span: dl.span,
  region: dl.region ?? 'ca-san-francisco',
  section: '',
}
