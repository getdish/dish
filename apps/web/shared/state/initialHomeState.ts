import { getTagId } from './getTagId'
import { HomeStateItemHome } from './home-types'
import { tagLenses } from './tagLenses'

export const initialHomeState: HomeStateItemHome = {
  id: '0',
  type: 'home',
  activeTagIds: {
    [getTagId(tagLenses[0])]: true,
  },
  searchQuery: '',
  center: {
    lng: -122.421351,
    lat: 37.759251,
  },
  span: { lng: 0.2 / 2, lat: 0.2 },
}
