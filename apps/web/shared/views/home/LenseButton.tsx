import {
  Box,
  HStack,
  HoverablePopover,
  LinearGradient,
  ZStack,
  memoIsEqualDeep,
} from '@dish/ui'
import React from 'react'
import { StyleSheet, Text } from 'react-native'

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
    const [r, g, b] = lense.rgb
    const rgbInner = `${r * 255}, ${g * 255}, ${b * 255}`
    const lenseColor = `rgb(${rgbInner})`
    const lenseColorLight = `rgba(${rgbInner}, 0.2)`
    const scale = size == 'md' ? 1 : 1.35

    const buttonContent = (
      <LinkButton tag={lense}>
        <ZStack fullscreen top={-9} bottom={-9}>
          <LinearGradient
            style={[
              StyleSheet.absoluteFill,
              {
                borderRadius: 1000,
                opacity: 0.3,
              },
            ]}
            colors={[lenseColorLight, 'white']}
          />
        </ZStack>
        <HStack
          alignItems="center"
          justifyContent="center"
          marginVertical={-10 * scale}
          width={40 * scale}
          // paddingLeft={6}
          height={40 * scale}
          paddingVertical={3 * scale}
          // backgroundColor={'rgba(255,255,255,0.5)'}
          borderRadius={100}
          // shadowRadius={2}
          // shadowColor={isActive ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.05)'}
          // shadowOffset={{ height: 1, width: 0 }}
          // borderWidth={2}
          borderColor="transparent"
          // opacity={0.8}
          hoverStyle={{
            borderColor: lenseColorLight,
            opacity: 1,
          }}
          {...(isActive && {
            opacity: 1,
            backgroundColor: 'white',
            borderColor: lenseColor,
            hoverStyle: {
              backgroundColor: 'white',
            },
          })}
        >
          <Text
            style={{
              color: isActive ? '#fff' : '#454545',
              fontSize: (isActive ? 40 : 24) * scale,
              lineHeight: 40 * scale,
              width: 36 * scale,
              height: 36 * scale,
              fontWeight: '400',
              textAlign: 'center',
              marginTop: (isActive ? -4 : 0) * scale,
              // marginLeft: 8,
              // letterSpacing: isActive ? -0.2 : 0,
            }}
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
        // anchor={anchor.RIGHT_CENTER}
        contents={
          <Box top={35} left={-35}>
            <Text style={{ fontSize: 16, fontWeight: '700' }}>
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
