import React, { memo } from 'react'
import { ScrollView, Text } from 'react-native'

import { useOvermind } from '../../state/om'
import { Tag } from '../../state/Tag'
import { LinkButton } from '../shared/Link'
import { HStack, VStack } from '../shared/Stacks'
import { bg, bgHover } from './colors'
import { SmallButton } from './SmallButton'

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

const FilterButton = memo(({ filter }: { filter: Tag }) => {
  const om = useOvermind()
  const isActive = om.state.home.currentActiveTagIds.some(
    (x) => filter.id === x
  )
  return (
    <LinkButton
      onPress={() => {
        om.actions.home.toggleActiveTag(filter)
      }}
    >
      <SmallButton isActive={isActive}>
        <Text
          style={{
            color: isActive ? '#000' : bg,
            fontSize: 15,
            fontWeight: '600',
          }}
        >
          {filter.name}
        </Text>
      </SmallButton>
    </LinkButton>
  )
})
