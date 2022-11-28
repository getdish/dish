import { useRegionQuery } from '../../helpers/fetchRegion'
import { HomeStateItemHome } from '../../types/homeTypes'
import { autocompletesStore } from '../AutocompletesStore'
import { useLastHomeState } from '../homeStore'
import { Link } from '../views/Link'
import { SlantedTitle } from '../views/SlantedTitle'
import { Theme } from '@dish/ui'
import React, { memo } from 'react'

export const HomeRegionTitle = memo(() => {
  const state = useLastHomeState('home', 'homeRegion') as HomeStateItemHome
  const enabled = !!state.region
  const regionResponse = useRegionQuery(state.region, {
    isPaused() {
      return !enabled
    },
    suspense: false,
  })
  const region = regionResponse.data
  const regionName = region?.name || state.curLocName || '...'

  return (
    <Link onPress={() => autocompletesStore.setTarget('location')}>
      <Theme inverse>
        <SlantedTitle alignSelf="center" fontWeight="900" size="$2">
          {regionName}
        </SlantedTitle>
      </Theme>
    </Link>
  )
})
