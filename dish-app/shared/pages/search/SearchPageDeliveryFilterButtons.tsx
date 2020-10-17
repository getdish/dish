import React, { memo } from 'react'
import { Image } from 'react-native'
import { Box, HStack, Text, VStack } from 'snackui'

import { useOvermind } from '../../state/om'
import { thirdPartyCrawlSources } from '../../thirdPartyCrawlSources'
import { FilterButton } from '../../views/FilterButton'

export const SearchPageDeliveryFilterButtons = memo(() => {
  const om = useOvermind()
  const currentState = om.state.home.currentState
  if (currentState.type !== 'search') {
    return null
  }
  const { activeTagIds } = currentState
  const sources = Object.keys(thirdPartyCrawlSources).filter(
    (key) => thirdPartyCrawlSources[key].delivery
  )
  const noneActive = sources.every((x) => !activeTagIds[x])
  return (
    <Box pointerEvents="auto" width={200}>
      <VStack spacing={4} padding={10} alignItems="stretch">
        {sources.map((key) => {
          const item = thirdPartyCrawlSources[key]
          const isActive = activeTagIds[key]
          return (
            <FilterButton
              tag={{
                name: key,
                type: 'filter',
              }}
              key={key}
              isActive={noneActive ? true : isActive}
              width={200 - 10 * 2}
              borderRadius={100}
              cursor="pointer"
              alignItems="center"
              justifyContent="center"
            >
              <HStack spacing={6} alignItems="center">
                <Image
                  source={item.image}
                  style={{
                    width: 20,
                    height: 20,
                    marginVertical: -4,
                    borderRadius: 100,
                  }}
                />
                <Text fontSize={14} fontWeight="500">
                  {item.name}
                </Text>
              </HStack>
            </FilterButton>
          )
        })}
      </VStack>
    </Box>
  )
})
