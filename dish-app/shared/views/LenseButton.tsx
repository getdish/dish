import React from 'react'
import { Text, VStack, memoIsEqualDeep } from 'snackui'

import { rgbString } from '../helpers/rgbString'
import { useIsNarrow } from '../hooks/useIs'
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
    const isSmall = useIsNarrow()
    const lenseColorLight = rgbString(lense.rgb, isSmall ? 0.6 : 0.4)
    const lenseColorDark = rgbString(lense.rgb.map((x) => x * 1.2))
    const scale = size == 'md' ? 1 : size === 'lg' ? 1.2 : 1.3
    const sizePx = isSmall ? 38 : 42
    const bg = backgroundColor ?? (isActive ? lenseColorLight : 'transparent')
    const iconSize = sizePx * (isActive ? 0.7 : 0.6) * scale
    const scaledSize = sizePx * scale
    const marginVertical = -4 * scale
    const color = isSmall || isActive ? '#fff' : lenseColorDark
    const lineHeight = sizePx * scale * 0.39

    return (
      <LinkButton
        {...(onPress ? { onPress } : { tag: lense })}
        className="unselectable"
        disallowDisableWhenActive
        marginRight={6}
        marginTop={-2}
        pressStyle={{
          opacity: 0.8,
          transform: [{ scale: 0.9 }],
        }}
      >
        <VStack
          className="ease-in-out-fast"
          alignItems="center"
          justifyContent="center"
          marginVertical={marginVertical}
          width={scaledSize}
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
          <Text
            fontSize={iconSize}
            lineHeight={scaledSize}
            fontWeight="400"
            textAlign="center"
          >
            {(lense.icon ?? '').trim()}
          </Text>
          <VStack
            transform={[{ rotate: '-10deg' }]}
            zIndex={100}
            alignItems="center"
            borderRadius={4}
            paddingHorizontal={4}
            paddingVertical={1}
            marginTop={-10}
            marginBottom={-8}
            backgroundColor="transparent"
            {...(isActive && {
              backgroundColor: lenseColorDark,
            })}
          >
            <VStack
              hoverStyle={{
                opacity: 1,
              }}
              marginHorizontal={-3}
            >
              <Text
                fontWeight="500"
                lineHeight={lineHeight}
                fontSize={isSmall ? 10 : 14}
                color={color}
                paddingHorizontal={2}
                textAlign="center"
                height={16}
              >
                {tagDisplayName(lense)}
              </Text>
            </VStack>
          </VStack>
        </VStack>
      </LinkButton>
    )
  }
)
