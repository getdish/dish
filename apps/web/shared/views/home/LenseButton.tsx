import React, { memo } from 'react'
import { anchor } from 'react-laag'
import { StyleSheet, Text } from 'react-native'

import { memoIsEqualDeep } from '../../helpers/memoIsEqualDeep'
import { Tag } from '../../state/Tag'
import { Box } from '../ui/Box'
import { HoverablePopover } from '../ui/HoverablePopover'
import { LinearGradient } from '../ui/LinearGradient'
import { LinkButton } from '../ui/Link'
import { HStack, ZStack } from '../ui/Stacks'

export const LenseButton = memoIsEqualDeep(
  ({
    lense,
    isActive,
    minimal,
  }: {
    lense: Tag
    isActive?: boolean
    minimal?: boolean
  }) => {
    const [r, g, b] = lense.rgb
    const rgbInner = `${r * 255}, ${g * 255}, ${b * 255}`
    const lenseColor = `rgb(${rgbInner})`
    const lenseColorLight = `rgba(${rgbInner}, 0.2)`
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
          marginVertical={-10}
          width={48}
          // paddingLeft={6}
          height={48}
          paddingVertical={3}
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
              fontSize: isActive ? 32 : 26,
              lineHeight: 40,
              width: 40,
              height: 40,
              fontWeight: '400',
              textAlign: 'center',
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
