import { HStack, Text } from '@dish/ui'
import React from 'react'
import { Image } from 'react-native'

import { HomeActiveTagIds } from '../../state/home'
import { LinkButton } from '../../views/ui/LinkButton'
import { flatButtonStyle } from './baseButtonStyle'
import { FilterButton } from './HomeFilterBar'
import { thirdPartyCrawlSources } from './thirdPartyCrawlSources'

export const HomeDeliveryFilterButtons = ({
  activeTagIds,
}: {
  activeTagIds: HomeActiveTagIds
}) => {
  console.log('activeTagIds', activeTagIds)
  if (!activeTagIds['delivery']) {
    return null
  }

  const sources = Object.keys(thirdPartyCrawlSources).filter(
    (key) => thirdPartyCrawlSources[key].delivery
  )
  const noneActive = sources.every((x) => !activeTagIds[x])

  return (
    <HStack
      marginTop={62}
      marginBottom={-62}
      spacing={10}
      backgroundColor="#fff"
      borderBottomColor="#eee"
      borderBottomWidth={1}
      zIndex={1000}
      position="relative"
      padding={5}
    >
      {sources.map((key) => {
        const item = thirdPartyCrawlSources[key]
        const isActive = activeTagIds[key]
        return (
          <FilterButton
            tag={{
              name: key,
              type: 'filter',
            }}
            {...flatButtonStyle}
            key={key}
            flex={1}
            isActive={noneActive ? true : isActive}
            padding={5}
            borderRadius={100}
            spacing={5}
            cursor="pointer"
            alignItems="center"
            justifyContent="center"
          >
            <HStack spacing={9} alignItems="center">
              <Image
                source={item.image}
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: 100,
                  margin: -3,
                }}
              />
              <Text fontSize={13} fontWeight="500">
                {item.name}
              </Text>
            </HStack>
          </FilterButton>
        )
      })}
    </HStack>
  )
}
