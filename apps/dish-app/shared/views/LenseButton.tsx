import { Tag } from '@dish/graph'
import { Text, VStack, memoIsEqualDeep } from '@dish/ui'
import React from 'react'

import { rgbString } from '../helpers/rgbString'
import { tagDisplayName } from '../state/tagDisplayName'
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
    lense: Tag
    isActive?: boolean
    backgroundColor?: string
    minimal?: boolean
    size?: LenseButtonSize
    onPress?: Function
  }) => {
    const lenseColor = rgbString(lense.rgb)
    const scale = size == 'md' ? 1 : size === 'lg' ? 1.2 : 1.3
    const sizePx = 48

    return (
      <LinkButton
        {...(onPress ? { onPress } : { tag: lense })}
        className="unselectable"
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
          borderColor="transparent"
          borderWidth={1}
          borderBottomColor="transparent"
          transform={[{ scale: 1 }]}
          hoverStyle={{
            borderColor: '#f0f0f0',
          }}
          {...(isActive && {
            // borderColor: lenseColor,
            transform: [{ scale: 1.12 }],
            hoverStyle: {
              transform: [{ scale: 1.12 }],
            },
          })}
        >
          <Text
            fontSize={sizePx * (isActive ? 0.85 : 0.6) * scale}
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
            marginTop={-10}
            marginBottom={-8}
            borderWidth={1}
            backgroundColor="transparent"
            borderColor="transparent"
            {...(isActive && {
              borderColor: lenseColor,
              backgroundColor: lenseColor,
            })}
          >
            <VStack
              opacity={
                size !== 'lg' ? (isActive ? 1 : 0.5) : isActive ? 1 : 0.8
              }
              hoverStyle={{
                opacity: 1,
              }}
              marginHorizontal={-3}
            >
              <Text
                fontSize={sizePx * scale * 0.3}
                fontWeight="400"
                lineHeight={sizePx * scale * 0.42}
                color={isActive ? '#fff' : '#000'}
                paddingHorizontal={2}
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
