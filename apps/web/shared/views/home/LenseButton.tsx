import React, { memo } from 'react'
import { Text } from 'react-native'

import { useOvermind } from '../../state/om'
import { Tag } from '../../state/Tag'
import { LinkButton } from '../shared/Link'
import { HStack } from '../shared/Stacks'
import { bg } from './colors'

export const LenseButton = memo(({ lense }: { lense: Tag }) => {
  const om = useOvermind()
  const activeIds = om.state.home.currentActiveTagIds
  const active = activeIds?.some((x) => x == lense.id)
  return (
    <LinkButton
      onPress={() => {
        const lastLense = om.state.home.allLenses.find((x) =>
          activeIds.some((y) => y === x.id)
        )
        om.actions.home.toggleActiveTag(lastLense)
        om.actions.home.toggleActiveTag(lense)
      }}
    >
      <HStack
        alignItems="center"
        justifyContent="center"
        paddingHorizontal={10}
        paddingVertical={5}
        backgroundColor={'rgba(255,255,255,0.5)'}
        borderRadius={12}
        shadowRadius={2}
        shadowColor={active ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.1)'}
        shadowOffset={{ height: 1, width: 0 }}
        borderWidth={1}
        borderColor={`rgba(0,0,0,0.15)`}
        opacity={0.8}
        hoverStyle={{
          opacity: 1,
        }}
        {...(active && {
          opacity: 1,
          backgroundColor: bg,
          // hoverStyle: {
          //   backgroundColor: bgHover,
          // },
        })}
      >
        <Text
          style={{
            color: active ? '#fff' : '#777',
            fontSize: 15,
            fontWeight: '600',
            // letterSpacing: active ? -0.2 : 0,
          }}
        >
          {lense.icon} {lense.name}
        </Text>
      </HStack>
    </LinkButton>
  )
})
