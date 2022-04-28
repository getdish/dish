import { thirdPartyCrawlSources } from '../../constants/thirdPartyCrawlSources'
import { useHomeStore } from '../homeStore'
import { FilterButton } from './FilterButton'
import { Image } from './Image'
import { Card, YStack } from '@dish/ui'
import React, { memo } from 'react'

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
    <Card pointerEvents="auto" width={200}>
      <YStack space={4} padding={10} alignItems="stretch">
        {sources.map((key) => {
          const item = thirdPartyCrawlSources[key]
          const isActive = noneActive ? true : activeTags[key]
          return (
            <FilterButton
              key={key}
              isActive={isActive}
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
      </YStack>
    </Card>
  )
})
