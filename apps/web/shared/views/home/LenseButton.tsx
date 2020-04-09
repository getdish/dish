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
    return (
      <LinkButton
        onPress={() => {
          om.actions.home.replaceActiveTagOfType(lense)
        }}
      >
        <HStack
          alignItems="center"
          justifyContent="center"
          paddingHorizontal={9}
          paddingVertical={4}
          backgroundColor={'rgba(255,255,255,0.5)'}
          borderRadius={12}
          shadowRadius={2}
          shadowColor={isActive ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.1)'}
          shadowOffset={{ height: 1, width: 0 }}
          borderWidth={1}
          borderColor={`rgba(0,0,0,0.15)`}
          opacity={0.8}
          hoverStyle={{
            opacity: 1,
          }}
          {...(isActive && {
            opacity: 1,
            backgroundColor: lense.rgb
              ? `rgb(${lense.rgb[0] * 255}, ${lense.rgb[1] * 255}, ${
                  lense.rgb[2] * 255
                })`
              : bg,
            // hoverStyle: {
            //   backgroundColor: bgHover,
            // },
          })}
        >
          <Text
            style={{
              color: isActive ? '#fff' : '#777',
              fontSize: 15,
              fontWeight: '600',
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
