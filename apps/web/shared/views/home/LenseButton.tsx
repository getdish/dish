import { Box, HStack, HoverablePopover, Text, memoIsEqualDeep } from '@dish/ui'
import React from 'react'
import { anchor } from 'react-laag'

import { Tag } from '../../state/Tag'
import { LinkButton } from '../ui/LinkButton'

export type LenseButtonSize = 'md' | 'lg'

export const LenseButton = memoIsEqualDeep(
  ({
    lense,
    isActive,
    minimal,
    size = 'md',
  }: {
    lense: Tag
    isActive?: boolean
    minimal?: boolean
    size?: LenseButtonSize
  }) => {
    const [r, g, b] = lense.rgb ?? [1, 1, 1]
    const rgbInner = `${r * 255}, ${g * 255}, ${b * 255}`
    const lenseColor = `rgb(${rgbInner})`
    const lenseColorLight = `rgba(${rgbInner}, 0.2)`
    const scale = size == 'md' ? 1 : 1.35

    const buttonContent = (
      <LinkButton tag={lense}>
        <HStack
          className="ease-in-out"
          alignItems="center"
          justifyContent="center"
          marginVertical={-10 * scale}
          width={40 * scale}
          height={40 * scale}
          paddingVertical={3 * scale}
          borderRadius={100}
          borderColor="transparent"
          hoverStyle={{
            borderColor: lenseColorLight,
            opacity: 1,
          }}
          {...(isActive && {
            opacity: 1,
            backgroundColor: 'white',
            borderColor: lenseColor,
            transform: [{ scale: 1.05 }],
            hoverStyle: {
              backgroundColor: 'white',
            },
          })}
        >
          <Text
            color={isActive ? '#fff' : '#454545'}
            fontSize={24 * scale}
            lineHeight={40 * scale}
            width={36 * scale}
            height={36 * scale}
            fontWeight="400"
            textAlign="center"
            marginTop={(isActive ? -4 : 0) * scale}
          >
            {(lense.icon ?? '').trim()}
            {!minimal
              ? ` ${`${lense.displayName ?? lense.name ?? ''}`.trim()}`
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
        position="right"
        anchor={anchor.RIGHT_BOTTOM}
        contents={
          <Box top={35} left={-35}>
            <Text fontSize={16} fontWeight="700">
              {lense.displayName ?? lense.name}
            </Text>
          </Box>
        }
      >
        {buttonContent}
      </HoverablePopover>
    )
  }
)
