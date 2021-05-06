import React from 'react'
import { StyleSheet } from 'react-native'
import { useTheme, useThemeName } from 'snackui'
import { AbsoluteVStack, HStack, LinearGradient, Paragraph, Spacer, Text, VStack } from 'snackui'

import {
  cardFrameBorderRadius,
  cardFrameHeight,
  cardFrameHeightSm,
  cardFrameWidth,
  cardFrameWidthSm,
} from '../../../constants/constants'
import { ColorShades, getColorsForColor, getColorsForName } from '../../../helpers/getColorsForName'
import { CardFrame } from '../../views/CardFrame'
import { Image } from '../../views/Image'

export type CardProps = {
  below?: ((colors: ColorShades) => any) | JSX.Element | string | null
  outside?: ((colors: ColorShades) => any) | JSX.Element | string | null
  photo?: string | JSX.Element | null
  title?: string | null
  subTitle?: string | null
  hideInfo?: boolean
  aspectFixed?: boolean
  hoverable?: boolean
  size?: 'sm' | 'md' | 'xs'
  backgroundColor?: string | null
  isBehind?: boolean
  dimImage?: boolean
  padTitleSide?: boolean
  square?: boolean
  colorsKey?: string
}

const widths = {
  xs: 250,
  sm: cardFrameWidthSm,
  md: cardFrameWidth,
}

const heights = {
  xs: 48,
  sm: cardFrameHeightSm,
  md: cardFrameHeight,
}

const scales = {
  xs: 0.6,
  sm: 0.85,
  md: 0.95,
}

const getLongestWord = (title: string) =>
  title?.split(' ').reduce((acc, cur) => Math.max(cur.length, acc), 0) ?? 0

export function Card({
  below,
  outside,
  photo,
  title = '',
  colorsKey,
  subTitle,
  padTitleSide,
  aspectFixed,
  hoverable,
  hideInfo,
  square,
  backgroundColor,
  isBehind,
  dimImage,
  size = 'md',
}: CardProps) {
  const colors = backgroundColor
    ? getColorsForColor(backgroundColor)
    : getColorsForName(colorsKey || title || '')
  const underColor = `${colors.pastelColor}99`
  const isSm = size === 'sm'
  const width = widths[size]
  const height = square ? width : heights[size]
  const sizes = {
    width,
    height,
  }
  const frame = {
    ...sizes,
    width: aspectFixed ? sizes.width : '100%',
  }
  const strTitle = title || ''
  const len = strTitle.length
  const lenScale = len > 50 ? 0.7 : len > 40 ? 0.8 : len > 30 ? 0.9 : 1
  const longestWordLen = getLongestWord(strTitle)
  const wordScale = longestWordLen > 14 ? 0.7 : longestWordLen > 9 ? 0.8 : 1
  const baseFontSize = 27 * lenScale * wordScale
  const fontSize = Math.round(baseFontSize * scales[size])

  console.log('photo', photo)

  return (
    <CardFrame square={square} size={size} aspectFixed={aspectFixed} hoverable={hoverable}>
      <VStack
        // borderWidth={2}
        borderColor={colors.pastelColor}
        borderRadius={cardFrameBorderRadius}
        width="100%"
        height="100%"
        position="relative"
      >
        {/* background */}
        <AbsoluteVStack
          fullscreen
          className="safari-fix-overflow chrome-fix-overflow"
          overflow="hidden"
          borderRadius={cardFrameBorderRadius}
          backgroundColor={backgroundColor || underColor || ''}
        >
          {/* behind shadow */}
          {isBehind && (
            <AbsoluteVStack
              className="ease-in-out"
              opacity={hideInfo ? 0 : 1}
              zIndex={1002}
              borderRadius={cardFrameBorderRadius}
              fullscreen
              transform={[{ translateX: -cardFrameWidth }]}
              // this makes react native work...
              backgroundColor="blue"
              shadowColor="#000"
              shadowOpacity={0.5}
              shadowRadius={100}
              shadowOffset={{ width: 10, height: 0 }}
            />
          )}

          <VStack className="hover-75-opacity-child" opacity={dimImage ? 0.5 : 1} {...frame}>
            {typeof photo === 'string' ? (
              photo ? (
                <Image resizeMode="cover" {...sizes} style={frame} source={{ uri: photo }} />
              ) : null
            ) : (
              photo
            )}
          </VStack>

          {/* bottom color gradient */}
          {/* <AbsoluteVStack
            className="hover-0-opacity-child ease-in-out"
            zIndex={10}
            left={0}
            bottom={0}
            top="30%"
            right={-20}
            transform={[{ rotate: '45deg' }, { scaleX: 2 }, { translateY: 20 }]}
          >
            <LinearGradient
              style={StyleSheet.absoluteFill}
              colors={['transparent', colors.darkColor]}
            />
          </AbsoluteVStack> */}

          {typeof below === 'function' ? below(colors) : below}
        </AbsoluteVStack>

        {typeof outside === 'function' ? outside(colors) : outside}

        <VStack
          className="safari-fix-overflow"
          fullscreen
          justifyContent="flex-end"
          pointerEvents="none"
          zIndex={11}
          borderRadius={cardFrameBorderRadius}
          overflow="hidden"
          flex={1}
        >
          {/* title gradient */}
          <AbsoluteVStack
            zIndex={-1}
            top={0}
            right={0}
            // opacity={0.8}
            transform={[{ rotate: '15deg' }, { scaleX: 2.5 }, { translateY: -20 }]}
          >
            <LinearGradient
              style={{ width: 150, height: 150 }}
              colors={[colors.pastelColor, colors.pastelColor, `${colors.darkColor}00`]}
            />
          </AbsoluteVStack>
          <VStack
            className="ease-in-out"
            opacity={hideInfo ? 0 : 1}
            paddingHorizontal={size === 'xs' ? 30 : 20}
            paddingVertical={size === 'xs' ? 15 : 20}
            flex={1}
          >
            <HStack flex={1} width="100%" maxWidth="100%">
              {!!padTitleSide && !isSm && <VStack minWidth={10} flex={1} />}
              <VStack flex={10} alignItems="flex-end">
                <VStack position="relative">
                  <Text
                    // not working below :(
                    className={size === 'xs' ? 'ellipse' : 'break-word'}
                    textAlign="right"
                    textShadowColor="#00000033"
                    textShadowRadius={2}
                    textShadowOffset={{ height: 2, width: 0 }}
                    fontWeight={size === 'sm' ? '700' : '600'}
                    letterSpacing={size === 'sm' ? -1 : -0.5}
                    color="#fff"
                    fontSize={fontSize}
                    numberOfLines={3}
                    lineHeight={fontSize * 1.1}
                    // flexShrink={0}
                  >
                    {title}
                  </Text>
                </VStack>
                <Spacer size="xs" />
                {!!subTitle && size !== 'xs' && (
                  <Paragraph
                    textAlign="right"
                    color="#fff"
                    fontWeight="800"
                    textShadowColor="#00000033"
                    textShadowRadius={2}
                    textShadowOffset={{ height: 2, width: 0 }}
                  >
                    {subTitle}
                  </Paragraph>
                )}
              </VStack>
            </HStack>
          </VStack>
        </VStack>
      </VStack>
    </CardFrame>
  )
}

export const CardOverlay = (props: { children: any }) => {
  return (
    <AbsoluteVStack
      fullscreen
      top="auto"
      justifyContent="flex-end"
      borderBottomLeftRadius={cardFrameBorderRadius}
      borderBottomRightRadius={cardFrameBorderRadius}
      overflow="hidden"
    >
      <VStack position="relative">
        <AbsoluteVStack left={0} right={0} bottom={0} top={-40}>
          <LinearGradient
            colors={['rgba(40,40,40,0)', 'rgba(40,40,40,1)']}
            style={StyleSheet.absoluteFill}
          />
        </AbsoluteVStack>
        <VStack alignItems="center" justifyContent="center" padding={10}>
          {props.children}
        </VStack>
      </VStack>
    </AbsoluteVStack>
  )
}
