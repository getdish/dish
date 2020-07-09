import { Text, VStack, memoIsEqualDeep } from '@dish/ui'
import React from 'react'

import { rgbString } from '../../helpers/rgbString'
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
    const lenseColor = rgbString(lense.rgb)
    // const lenseColorLight = `rgba(${rgbInner}, 0.2)`
    const scale = size == 'md' ? 1 : 1.35
    const sizePx = 40

    return (
      <LinkButton tag={lense} position="relative" zIndex={isActive ? 1 : 0}>
        <VStack
          className="ease-in-out-faster"
          alignItems="center"
          justifyContent="center"
          marginVertical={-5 * scale}
          width={sizePx * scale}
          height={sizePx * scale}
          borderRadius={100}
          borderColor="transparent"
          borderWidth={1}
          borderBottomColor="transparent"
          hoverStyle={{
            borderColor: '#ccc',
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
            fontSize={sizePx * (isActive ? 0.7 : 0.4) * scale}
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
            borderRadius={4}
            paddingHorizontal={3}
            marginTop={-8}
            marginBottom={-5}
            {...(isActive && {
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
                {lense.displayName ?? lense.name}
              </Text>
            </VStack>
          </VStack>
        </VStack>
      </LinkButton>
    )
  }
)
