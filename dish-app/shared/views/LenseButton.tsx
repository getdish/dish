import React, { useMemo } from 'react'
import { Text, VStack, memoIsEqualDeep, useMedia } from 'snackui'

import { rgbString } from '../helpers/rgbString'
import { NavigableTag } from '../state/NavigableTag'
import { tagDisplayName } from '../state/tagMeta'
import { LinkButton } from './ui/LinkButton'

export type LenseButtonSize = 'md' | 'lg' | 'xl'

export const LenseButton = memoIsEqualDeep(
  ({
    lense,
    isActive,
    minimal,
    size = 'md',
    backgroundColor,
    onPress,
  }: {
    lense: NavigableTag
    isActive?: boolean
    backgroundColor?: string
    minimal?: boolean
    size?: LenseButtonSize
    onPress?: Function
  }) => {
    const media = useMedia()
    const lenseColorLight = rgbString(lense.rgb, media.sm ? 0.6 : 0.4)
    const lenseColorDark = rgbString(lense.rgb.map((x) => x * 1.2))
    const scale = size == 'md' ? 1 : size === 'lg' ? 1.2 : 1.3
    const sizePx = media.sm ? 42 : 42
    const bg = backgroundColor ?? (isActive ? lenseColorLight : 'transparent')
    const iconSize = sizePx * (isActive ? 0.7 : 0.6) * scale
    const scaledSize = sizePx * scale
    const scaledWidth = scaledSize
    const color = media.sm || isActive ? '#ffffff' : lenseColorDark
    const lineHeight = sizePx * scale * 0.39

    return (
      <LinkButton
        {...(onPress ? { onPress } : { tag: lense })}
        className="unselectable"
        disallowDisableWhenActive
        marginRight={5}
        marginTop={-10}
        pressStyle={{
          opacity: 0.8,
          transform: [{ scale: 0.9 }],
        }}
      >
        <VStack
          className="ease-in-out-fast"
          alignItems="center"
          justifyContent="center"
          width={scaledWidth}
          height={scaledSize}
          backgroundColor={bg}
          borderRadius={100}
          transform={[{ scale: 1 }]}
          {...(isActive && {
            transform: [{ scale: 1.12 }],
            hoverStyle: {
              transform: [{ scale: 1.12 }],
            },
          })}
        >
          <Text fontSize={iconSize} lineHeight={scaledSize} textAlign="center">
            {(lense.icon ?? '').trim()}
          </Text>
          <VStack
            transform={[{ rotate: '-10deg' }]}
            zIndex={100}
            alignItems="center"
            borderRadius={4}
            paddingHorizontal={4}
            paddingVertical={1}
            marginTop={-12}
            backgroundColor="transparent"
            {...(isActive && {
              backgroundColor: lenseColorDark,
            })}
          >
            <Text
              fontWeight="700"
              lineHeight={lineHeight}
              fontSize={14}
              color={color}
              paddingHorizontal={2}
              textAlign="center"
              height={16}
            >
              {tagDisplayName(lense)}
            </Text>
          </VStack>
        </VStack>
      </LinkButton>
    )
  }
)
