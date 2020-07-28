import { Tag } from '@dish/graph'
import { Text, VStack, memoIsEqualDeep } from '@dish/ui'
import React from 'react'

import { rgbString } from '../../helpers/rgbString'
import { tagDisplayName } from '../../state/tagDisplayName'
import { LinkButton } from '../../views/ui/LinkButton'

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
    lense: Tag
    isActive?: boolean
    backgroundColor?: string
    minimal?: boolean
    size?: LenseButtonSize
    onPress?: Function
  }) => {
    const lenseColor = rgbString(lense.rgb)
    // const lenseColorLight = `rgba(${rgbInner}, 0.2)`
    const scale = size == 'md' ? 1 : size === 'lg' ? 1.3 : 1.4
    const sizePx = 46
    const borderColor = minimal ? 'transparent' : '#f5f5f5'

    return (
      <LinkButton
        {...(onPress ? { onPress } : { tag: lense })}
        disallowDisableWhenActive
        position="relative"
        zIndex={isActive ? 1 : 0}
        pressStyle={{
          opacity: 0.8,
          transform: [{ scale: 0.9 }],
        }}
      >
        <VStack
          className="ease-in-out-fast"
          alignItems="center"
          justifyContent="center"
          marginVertical={-5 * scale}
          width={sizePx * scale}
          height={sizePx * scale}
          backgroundColor={backgroundColor ?? '#fff'}
          borderRadius={100}
          borderColor={borderColor}
          borderWidth={1}
          borderBottomColor="transparent"
          transform={[{ scale: 1 }]}
          {...(isActive && {
            borderColor: lenseColor,
            transform: [{ scale: 1.12 }],
            hoverStyle: {
              transform: [{ scale: 1.12 }],
            },
          })}
        >
          <Text
            fontSize={sizePx * (isActive ? 0.7 : 0.5) * scale}
            lineHeight={sizePx * scale}
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
            paddingHorizontal={3}
            marginTop={-8}
            marginBottom={-5}
            backgroundColor="#fff"
            // borderWidth={1}
            // borderColor="#ddd"
            {...(isActive && {
              borderColor: lenseColor,
              backgroundColor: lenseColor,
            })}
          >
            <VStack
              opacity={isActive ? 1 : 0.8}
              hoverStyle={{
                opacity: 1,
              }}
            >
              <Text
                fontSize={13}
                fontWeight="400"
                lineHeight={15}
                color={isActive ? '#fff' : '#000'}
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
