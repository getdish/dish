import {
  Box,
  HStack,
  HoverablePopover,
  Text,
  VStack,
  memoIsEqualDeep,
} from '@dish/ui'
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
    // const lenseColorLight = `rgba(${rgbInner}, 0.2)`
    const scale = size == 'md' ? 1 : 1.35
    const sizePx = 40

    return (
      <LinkButton tag={lense}>
        <VStack
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
            transform: [{ scale: 1.1 }],
          }}
          {...(isActive && {
            opacity: 1,
            borderColor: lenseColor,
            transform: [{ scale: 1.15 }],
            hoverStyle: {
              transform: [{ scale: 1.15 }],
            },
          })}
        >
          <Text
            color={isActive ? '#fff' : '#454545'}
            fontSize={sizePx * 0.5 * scale}
            lineHeight={16}
            {...(!minimal && {
              lineHeight: sizePx * scale,
            })}
            fontWeight="400"
            textAlign="center"
          >
            {(lense.icon ?? '').trim()}
          </Text>
          <VStack
            transform={[{ rotate: '-10deg' }]}
            zIndex={100}
            alignItems="center"
            marginBottom={-5}
            marginTop={-10}
            {...(isActive && {
              backgroundColor: '#000',
            })}
          >
            <Text
              fontSize={13}
              fontWeight="400"
              color={isActive ? '#fff' : '#000'}
            >
              {lense.displayName ?? lense.name}
            </Text>
          </VStack>
        </VStack>
      </LinkButton>
    )
  }
)
