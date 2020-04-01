import React, { memo } from 'react'
import { ScrollView, Text } from 'react-native'

import { useOvermind } from '../../state/om'
import { Taxonomy } from '../../state/Taxonomy'
import { LinkButton } from '../shared/Link'
import { HStack, VStack } from '../shared/Stacks'

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
        paddingHorizontal={12}
        paddingVertical={4}
        backgroundColor={
          isActive ? `rgba(10, 10, 10, 1)` : `rgba(10, 10, 10, 0.55)`
        }
        borderRadius={20}
        borderWidth={2}
        borderColor={isActive ? `#000` : 'white'}
        hoverStyle={
          isActive
            ? {}
            : {
                backgroundColor: 'rgba(80, 80, 80, 0.9)',
              }
        }
      >
        <Text
          style={{
            color: isActive ? '#fff' : '#eee',
            fontSize: 14,
            fontWeight: '500',
          }}
        >
          {filter.name}
        </Text>
      </HStack>
    </LinkButton>
  )
})
