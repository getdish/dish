import React, { memo } from 'react'
import { Text } from 'react-native'

import { useOvermind } from '../../state/om'
import { Tag } from '../../state/Tag'
import { Box } from '../ui/Box'
import { HoverablePopover } from '../ui/HoverablePopover'
import { LinkButton } from '../ui/Link'
import { HStack } from '../ui/Stacks'
import { bg } from './colors'

export const LenseButton = memo(
  ({
    lense,
    isActive,
    minimal,
  }: {
    lense: Tag
    isActive?: boolean
    minimal?: boolean
  }) => {
    const om = useOvermind()
    const lenseColor = `rgb(${lense.rgb[0] * 255}, ${lense.rgb[1] *
      255}, ${lense.rgb[2] * 255})`
    const buttonContent = (
      <LinkButton
        onPress={() => {
          om.actions.home.replaceActiveTagOfType(lense)
        }}
      >
        <HStack
          alignItems="center"
          justifyContent="center"
          paddingHorizontal={14}
          paddingVertical={8}
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
              fontSize: 18,
              fontWeight: '400',
              // letterSpacing: isActive ? -0.2 : 0,
            }}
          >
            {lense.icon}
            {!minimal ? ` ${lense.displayName ?? lense.name}` : null}
          </Text>
        </HStack>
      </LinkButton>
    )

    if (!minimal) {
      return buttonContent
    }

    return (
      <HoverablePopover
        noArrow
        position="bottom"
        contents={
          <Box>
            <Text>{lense.displayName ?? lense.name}</Text>
          </Box>
        }
      >
        {buttonContent}
      </HoverablePopover>
    )
  }
)
