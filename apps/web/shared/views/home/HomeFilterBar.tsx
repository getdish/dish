import React, { memo } from 'react'
import { ScrollView, Text } from 'react-native'

import { useOvermind } from '../../state/om'
import { Taxonomy } from '../../state/Taxonomy'
import { LinkButton } from '../shared/Link'
import { Spacer } from '../shared/Spacer'
import { HStack, VStack } from '../shared/Stacks'

export default memo(function HomeFilterBar() {
  const om = useOvermind()
  const { lastHomeState } = om.state.home

  return (
    <VStack paddingVertical={12} paddingBottom={6}>
      {/* <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          justifyContent: 'center',
          alignItems: 'center',
        }}
      > */}
      <HStack
        paddingHorizontal={30}
        paddingVertical={2}
        alignItems="center"
        justifyContent="center"
      >
        {lastHomeState.filters.map((filter, index) => (
          <React.Fragment key={filter.id}>
            <FilterButton filter={filter} />
            <Spacer size={7} />
          </React.Fragment>
        ))}
      </HStack>
      {/* </ScrollView> */}
    </VStack>
  )
})

function FilterButton({ filter }: { filter: Taxonomy }) {
  return (
    <LinkButton>
      <HStack
        alignItems="center"
        justifyContent="center"
        paddingHorizontal={12}
        paddingVertical={4}
        backgroundColor={`rgba(10, 10, 10, 0)`}
        borderRadius={20}
        // borderWidth={1}
        // borderColor={`rgba(0,0,0,0.15)`}
        hoverStyle={{
          backgroundColor: 'rgba(80, 80, 80, 0.9)',
        }}
      >
        <Text
          style={{
            color: '#fff',
            fontSize: 14,
            fontWeight: filter.isActive ? '700' : '500',
          }}
        >
          {filter.name}
        </Text>
      </HStack>
    </LinkButton>
  )
}
