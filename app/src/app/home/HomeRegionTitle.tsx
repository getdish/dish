import React, { memo } from 'react'
import { ThemeInverse } from 'snackui'

import { useRegionQuery } from '../../helpers/fetchRegion'
import { HomeStateItemHome } from '../../types/homeTypes'
import { autocompletesStore } from '../AutocompletesStore'
import { useLastHomeState } from '../homeStore'
import { Link } from '../views/Link'
import { SlantedTitle } from '../views/SlantedTitle'

export const HomeRegionTitle = memo(() => {
  // const media = useMedia()
  const state = useLastHomeState('home', 'homeRegion') as HomeStateItemHome
  const enabled = !!state.region
  const regionResponse = useRegionQuery(state.region, {
    enabled,
    suspense: true,
  })
  const region = regionResponse.data
  const regionName = region?.name || state.curLocName || '...'

  return (
    <Link onPress={() => autocompletesStore.setTarget('location')}>
      <ThemeInverse>
        <SlantedTitle
          // backgroundColor="#000"
          // color="#fff"
          alignSelf="center"
          fontWeight="900"
          size={
            regionName.length > 24
              ? 'xxxs'
              : regionName.length > 17
              ? 'xxs'
              : regionName.length > 14
              ? 'xs'
              : regionName.length > 8
              ? 'sm'
              : 'md'
          }
        >
          {regionName}
        </SlantedTitle>
      </ThemeInverse>
    </Link>
  )
})
