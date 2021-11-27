import { ThemeInverse } from '@dish/ui'
import React, { memo } from 'react'
import { useRegionQuery } from '../../helpers/fetchRegion'
import { HomeStateItemHome } from '../../types/homeTypes'
import { autocompletesStore } from '../AutocompletesStore'
import { useLastHomeState } from '../homeStore'
import { Link } from '../views/Link'
import { SlantedTitle } from '../views/SlantedTitle'

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
      <ThemeInverse>
        <SlantedTitle
          alignSelf="center"
          fontWeight="900"
          size={
            regionName.length > 24
              ? '$2'
              : regionName.length > 17
              ? '$3'
              : regionName.length > 14
              ? '$4'
              : regionName.length > 8
              ? '$5'
              : '$6'
          }
        >
          {regionName}
        </SlantedTitle>
      </ThemeInverse>
    </Link>
  )
})
