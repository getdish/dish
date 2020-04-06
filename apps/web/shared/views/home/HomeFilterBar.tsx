import React, { memo } from 'react'
import { ScrollView, Text } from 'react-native'

import { useOvermind } from '../../state/om'
import { Taxonomy } from '../../state/Taxonomy'
import { LinkButton } from '../shared/Link'
import { HStack, VStack } from '../shared/Stacks'
import {
  bg,
  bgHover,
  flatButtonStyle,
  lightBg,
  lightBgHover,
} from './baseButtonStyle'

export default memo(function HomeFilterBar() {
  const om = useOvermind()
  return (
    <VStack paddingVertical={8} paddingBottom={6}>
      <HStack
        paddingHorizontal={30}
        paddingVertical={2}
        alignItems="center"
        spacing={3}
        justifyContent="center"
      >
        {om.state.home.allFilters.map((filter) => (
          <FilterButton key={filter.id} filter={filter} />
        ))}
      </HStack>
    </VStack>
  )
})

const FilterButton = memo(({ filter }: { filter: Taxonomy }) => {
  const om = useOvermind()
  const isActive = om.state.home.currentActiveTaxonomyIds.some(
    (x) => filter.id === x
  )
  return (
    <LinkButton
      onPress={() => {
        om.actions.home.toggleActiveTaxonomy(filter)
      }}
    >
      <HStack
        alignItems="center"
        justifyContent="center"
        {...flatButtonStyle}
        paddingHorizontal={12}
        paddingVertical={4}
        backgroundColor={isActive ? 'transparent' : lightBg}
        borderRadius={20}
        borderWidth={2}
        borderColor={isActive ? `#000` : 'white'}
        hoverStyle={
          isActive
            ? {
                // backgroundColor: bgHover,
              }
            : {
                backgroundColor: lightBgHover,
              }
        }
      >
        <Text
          style={{
            color: isActive ? '#000' : bg,
            fontSize: 14,
            fontWeight: '600',
          }}
        >
          {filter.name}
        </Text>
      </HStack>
    </LinkButton>
  )
})
