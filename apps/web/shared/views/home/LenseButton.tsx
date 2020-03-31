import React, { memo } from 'react'
import { Text } from 'react-native'

import { useOvermind } from '../../state/om'
import { Taxonomy } from '../../state/Taxonomy'
import { LinkButton } from '../shared/Link'
import { HStack } from '../shared/Stacks'

export const LenseButton = memo(({ lense }: { lense: Taxonomy }) => {
  const om = useOvermind()
  const activeIds = om.state.home.currentActiveTaxonomyIds
  const active = activeIds?.some((x) => x == lense.id)
  return (
    <LinkButton
      onPress={() => {
        const lastLense = om.state.home.allLenses.find((x) =>
          activeIds.some((y) => y === x.id)
        )
        om.actions.home.toggleActiveTaxonomy(lastLense)
        om.actions.home.toggleActiveTaxonomy(lense)
      }}
    >
      <HStack
        alignItems="center"
        justifyContent="center"
        paddingHorizontal={10}
        paddingVertical={5}
        backgroundColor={active ? '#fff' : 'rgba(255,255,255,0.5)'}
        borderRadius={8}
        shadowRadius={2}
        shadowColor="rgba(0,0,0,0.1)"
        shadowOffset={{ height: 1, width: 0 }}
        borderWidth={1}
        borderColor={`rgba(0,0,0,0.15)`}
      >
        <Text
          style={{
            color: active ? '#000' : '#777',
            fontSize: 16,
            fontWeight: active ? '700' : '500',
          }}
        >
          {lense.icon} {lense.name}
        </Text>
      </HStack>
    </LinkButton>
  )
})
