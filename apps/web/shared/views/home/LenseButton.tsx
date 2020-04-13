import React, { memo } from 'react'
import { Text } from 'react-native'

import { useOvermind } from '../../state/om'
import { Tag } from '../../state/Tag'
import { LinkButton } from '../shared/Link'
import { HStack } from '../shared/Stacks'
import { bg } from './colors'

export const LenseButton = memo(
  ({ lense, isActive }: { lense: Tag; isActive: boolean }) => {
    const om = useOvermind()
    const lenseColor = `rgb(${lense.rgb[0] * 255}, ${lense.rgb[1] *
      255}, ${lense.rgb[2] * 255})`
    return (
      <LinkButton
        onPress={() => {
          om.actions.home.replaceActiveTagOfType(lense)
        }}
      >
        <HStack
          alignItems="center"
          justifyContent="center"
          paddingHorizontal={10}
          paddingVertical={4}
          // backgroundColor={'rgba(255,255,255,0.5)'}
          // borderRadius={10}
          // shadowRadius={2}
          // shadowColor={isActive ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.05)'}
          // shadowOffset={{ height: 1, width: 0 }}
          borderBottomWidth={1}
          borderColor={`#fff`}
          opacity={0.8}
          hoverStyle={{
            borderColor: lenseColor,
            opacity: 1,
          }}
          {...(isActive && {
            opacity: 1,
            borderColor: lense.rgb ? lenseColor : bg,
            // hoverStyle: {
            //   backgroundColor: bgHover,
            // },
          })}
        >
          <Text
            style={{
              color: isActive ? lenseColor : '#454545',
              fontSize: 16,
              fontWeight: '400',
              // letterSpacing: isActive ? -0.2 : 0,
            }}
          >
            {lense.icon} {lense.displayName ?? lense.name}
          </Text>
        </HStack>
      </LinkButton>
    )
  }
)
