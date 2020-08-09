import { getDefaultLocation } from './getDefaultLocation'
import { getTagId } from './getTagId'
import { HomeStateItem, HomeStateItemHome } from './home-types'
import { tagLenses } from './tagLenses'

export const initialHomeState: HomeStateItemHome = {
  id: '0',
  type: 'home',
  activeTagIds: {
    [getTagId(tagLenses[0])]: true,
  },
  searchQuery: '',
  ...getDefaultLocation(),
}

export type HomeStateItemLocation = {
  center: HomeStateItem['center']
  span: HomeStateItem['span']
}
