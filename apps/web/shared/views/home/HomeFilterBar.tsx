import React, { memo } from 'react'
import { Text, ScrollView } from 'react-native'
import { useOvermind } from '../../state/om'
import { Spacer } from '../shared/Spacer'
import { VStack, HStack } from '../shared/Stacks'
import { Taxonomy } from '../../state/Taxonomy'
import { LinkButton } from '../shared/Link'

export default memo(function HomeFilterBar() {
  const om = useOvermind()
  const { lastHomeState } = om.state.home

  return (
    <VStack paddingVertical={12}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <HStack paddingHorizontal={20} paddingVertical={2}>
          {lastHomeState.filters.map((filter, index) => (
            <React.Fragment key={filter.id}>
              <FilterButton filter={filter} />
              <Spacer />
            </React.Fragment>
          ))}
        </HStack>
      </ScrollView>
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
        backgroundColor={`rgba(100, 100, 100, 0.75)`}
        borderRadius={20}
        // borderWidth={1}
        // borderColor={`rgba(0,0,0,0.15)`}
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
