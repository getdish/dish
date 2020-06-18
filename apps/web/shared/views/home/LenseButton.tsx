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
          marginVertical={-12 * scale}
          width={sizePx * scale}
          height={sizePx * scale}
          borderRadius={100}
          borderColor="transparent"
          borderWidth={1}
          borderBottomColor="transparent"
          hoverStyle={{
            borderColor: lenseColorLight,
            opacity: 1,
            transform: [{ scale: 1.1 }],
          }}
          {...(isActive && {
            opacity: 1,
            borderColor: lenseColor,
            transform: [{ scale: 1.35 }],
            hoverStyle: {
              transform: [{ scale: 1.35 }],
            },
          })}
        >
          <Text
            color={isActive ? '#fff' : '#454545'}
            fontSize={sizePx * 0.65 * scale}
            lineHeight={16}
            {...(!minimal && {
              lineHeight: sizePx * scale,
            })}
            fontWeight="400"
            textAlign="center"
          >
            {(lense.icon ?? '').trim()}
            {minimal ? (
              <Text fontSize={12}>
                {(lense.displayName ?? lense.name ?? '').trim()}
              </Text>
            ) : null}
          </Text>
        </HStack>
      </LinkButton>
    )

    if (minimal) {
      return buttonContent
    }

    return (
      <HoverablePopover
        {...(isActive && {
          isOpen: true,
        })}
        noArrow
        position="bottom"
        contents={
          <Box
            marginTop={-5}
            transform={isActive ? [{ scale: 0.65 }, { translateY: -20 }] : null}
            backgroundColor={isActive ? '#000' : '#fff'}
          >
            <Text
              fontSize={16}
              fontWeight="700"
              color={isActive ? '#fff' : '#000'}
            >
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
