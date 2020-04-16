import React, { memo } from 'react'
import { Text } from 'react-native'

import { useOvermind } from '../../state/om'
import { Tag } from '../../state/Tag'
import { Box } from '../ui/Box'
import { HoverablePopover } from '../ui/HoverablePopover'
import { LinkButton } from '../ui/Link'
import { HStack } from '../ui/Stacks'

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
    const [r, g, b] = lense.rgb
    const rgbInner = `${r * 255}, ${g * 255}, ${b * 255}`
    const lenseColor = `rgb(${rgbInner})`
    const lenseColorLight = `rgba(${rgbInner}, 0.35)`
    const buttonContent = (
      <LinkButton {...om.actions.home.getNavigateToTag(lense)}>
        <HStack
          alignItems="center"
          justifyContent="center"
          paddingHorizontal={10}
          // paddingLeft={6}
          height={34}
          paddingVertical={3}
          // backgroundColor={'rgba(255,255,255,0.5)'}
          borderRadius={100}
          // shadowRadius={2}
          // shadowColor={isActive ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.05)'}
          // shadowOffset={{ height: 1, width: 0 }}
          borderWidth={2}
          borderColor="transparent"
          opacity={0.8}
          hoverStyle={{
            borderColor: lenseColorLight,
            opacity: 1,
          }}
          {...(isActive && {
            opacity: 1,
            backgroundColor: lenseColor,
            borderColor: lenseColor,
            // hoverStyle: {
            //   backgroundColor: bgHover,
            // },
          })}
        >
          <Text
            style={{
              color: isActive ? '#fff' : '#454545',
              fontSize: 24,
              width: 30,
              height: 30,
              fontWeight: '400',
              textAlign: 'center',
              // marginLeft: 8,
              // letterSpacing: isActive ? -0.2 : 0,
            }}
          >
            {(lense.icon ?? '').trim()}
            {!minimal
              ? ` ${lense.displayName ?? lense.name ?? ''}`.trimEnd()
              : null}
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
