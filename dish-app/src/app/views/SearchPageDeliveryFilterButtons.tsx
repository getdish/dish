import React, { memo } from 'react'
import { Image } from 'react-native'
import { Box, Theme, VStack } from 'snackui'

import { thirdPartyCrawlSources } from '../../constants/thirdPartyCrawlSources'
import { useHomeStore } from '../homeStore'
import { FilterButton } from './FilterButton'

export const SearchPageDeliveryFilterButtons = memo(() => {
  const home = useHomeStore()
  const currentState = home.currentState
  if (currentState.type !== 'search') {
    return null
  }
  const { activeTags } = currentState
  const sources = Object.keys(thirdPartyCrawlSources).filter(
    (key) => thirdPartyCrawlSources[key].delivery
  )
  const noneActive = sources.every((x) => !activeTags[x])
  return (
    <Box pointerEvents="auto" width={200}>
      <VStack spacing={4} padding={10} alignItems="stretch">
        {sources.map((key) => {
          const item = thirdPartyCrawlSources[key]
          const isActive = noneActive ? true : activeTags[key]
          return (
            <FilterButton
              key={key}
              theme={isActive ? 'active' : null}
              tag={{
                name: key,
                type: 'filter',
                slug: item.tagSlug,
              }}
              width={200 - 10 * 2}
              borderRadius={100}
              icon={
                <Image
                  source={item.image}
                  style={{
                    width: 20,
                    height: 20,
                    marginVertical: -4,
                    borderRadius: 100,
                  }}
                />
              }
            >
              {item.name}
            </FilterButton>
          )
        })}
      </VStack>
    </Box>
  )
})
