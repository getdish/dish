// debug
import { Tag } from '@dish/graph'
import { Text, VStack, memoIsEqualDeep } from '@dish/ui'
import React from 'react'

import { rgbString } from '../../helpers/rgbString'
import { LinkButton } from '../../views/ui/LinkButton'

export type LenseButtonSize = 'md' | 'lg' | 'xl'

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
    const scale = size == 'md' ? 1 : size === 'lg' ? 1.3 : 1.5
    const sizePx = 42
    const borderColor = minimal ? 'transparent' : '#f5f5f5'

    return (
      // <LinkButton
      //   tag={lense}
      //   disallowDisableWhenActive
      //   position="relative"
      //   zIndex={isActive ? 1 : 0}
      // >
      <VStack
        className="ease-in-out-fast"
        alignItems="center"
        justifyContent="center"
        marginVertical={-5 * scale}
        width={sizePx * scale}
        height={sizePx * scale}
        backgroundColor="#fff"
        borderRadius={100}
        borderColor={borderColor}
        borderWidth={1}
        borderBottomColor="transparent"
        {...(isActive && {
          opacity: 1,
          borderColor: lenseColor,
          transform: [{ scale: 1.15 }],
          hoverStyle: {
            transform: [{ scale: 1.15 }],
          },
        })}
      >
        {/* <Text
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
            borderWidth={1}
            borderColor="#ddd"
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
                {lense.displayName ?? lense.name}
              </Text>
            </VStack>
          </VStack> */}
      </VStack>
      // </LinkButton>
    )
  }
)
