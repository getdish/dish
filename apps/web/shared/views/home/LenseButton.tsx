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
    const sizePx = 40

    const buttonContent = (
      <LinkButton tag={lense}>
        <HStack
          alignItems="center"
          justifyContent="center"
          marginVertical={-10 * scale}
          width={sizePx * scale}
          height={sizePx * scale}
          paddingVertical={3 * scale}
          borderRadius={100}
          borderColor="transparent"
          borderBottomWidth={10}
          borderBottomColor="transparent"
          hoverStyle={{
            borderColor: lenseColorLight,
            opacity: 1,
            transform: [{ scale: 1.1 }],
          }}
          {...(isActive && {
            opacity: 1,
            backgroundColor: 'white',
            borderColor: lenseColor,
            transform: [{ scale: 1.5 }],
            hoverStyle: {
              backgroundColor: 'white',
            },
          })}
        >
          <Text
            color={isActive ? '#fff' : '#454545'}
            fontSize={sizePx * 0.5 * scale}
            lineHeight={sizePx * scale}
            width={sizePx * 0.9 * scale}
            height={sizePx * 0.9 * scale}
            fontWeight="400"
            textAlign="center"
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
