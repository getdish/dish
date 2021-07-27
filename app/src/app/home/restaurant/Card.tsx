import React from 'react'
import { StyleSheet } from 'react-native'
import { AbsoluteVStack, HStack, LinearGradient, Paragraph, Spacer, Text, VStack } from 'snackui'

import {
  cardFrameBorderRadius,
  cardFrameHeight,
  cardFrameHeightSm,
  cardFrameWidth,
  cardFrameWidthSm,
  isWeb,
} from '../../../constants/constants'
import { ColorShades, getColorsForColor, getColorsForName } from '../../../helpers/getColorsForName'
import { CardFrame } from '../../views/CardFrame'
import { Image } from '../../views/Image'

export type CardProps = {
  below?: ((colors: ColorShades) => any) | JSX.Element | string | null
  outside?: ((colors: ColorShades) => any) | JSX.Element | string | null
  photo?: string | JSX.Element | null
  title?: string | JSX.Element | null
  subTitle?: string | null
  hideInfo?: boolean
  aspectFixed?: boolean
  hoverable?: boolean
  size?: 'sm' | 'md' | 'xs'
  backgroundColor?: string | null
  borderColor?: string | null
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
  borderColor,
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
    : typeof title === 'string'
    ? getColorsForName(colorsKey || title || '')
    : getColorsForName('')
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
  const strTitle = typeof title === 'string' ? title : 'hello world'
  const len = strTitle.length
  const lenScale = len > 50 ? 0.7 : len > 40 ? 0.8 : len > 30 ? 0.9 : 1
  const longestWordLen = getLongestWord(strTitle)
  const wordScale = longestWordLen > 14 ? 0.7 : longestWordLen > 9 ? 0.8 : 1
  const baseFontSize = 25 * lenScale * wordScale
  const fontSize = Math.round(baseFontSize * scales[size])

  return (
    <CardFrame
      borderColor={borderColor}
      square={square}
      size={size}
      aspectFixed={aspectFixed}
      hoverable={hoverable}
    >
      {/* background */}
      <AbsoluteVStack
        fullscreen
        className="chrome-fix-overflow"
        scale={1}
        overflow="hidden"
        borderRadius={cardFrameBorderRadius}
        backgroundColor={backgroundColor || underColor || ''}
      >
        {/* behind shadow */}
        {/* on native this causes laggy scrolls */}
        {isWeb && isBehind && (
          <AbsoluteVStack
            className="ease-in-out"
            opacity={hideInfo ? 0 : 1}
            zIndex={1002}
            borderRadius={cardFrameBorderRadius}
            fullscreen
            x={-cardFrameWidth}
            // this makes react native work...
            backgroundColor="rgba(0,0,0,0.1)"
            shadowColor="#000"
            shadowOpacity={0.5}
            shadowRadius={100}
            shadowOffset={{ width: 10, height: 0 }}
          />
        )}

        <VStack className="hover-75-opacity-child" opacity={dimImage ? 0.76 : 1} {...frame}>
          {typeof photo === 'string' ? (
            photo ? (
              <Image resizeMode="cover" {...sizes} style={frame} source={{ uri: photo }} />
            ) : null
          ) : (
            photo
          )}
        </VStack>

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
        width="100%"
        height="100%"
      >
        {/* title gradient */}
        {/* <AbsoluteVStack
          zIndex={-1}
          width={cardFrameWidth}
          height={cardFrameHeight}
          rotate="25deg"
          y={-60}
          x={-20}
          scaleX={1.5}
        >
          <LinearGradient
            style={StyleSheet.absoluteFill}
            colors={[colors.color, colors.pastelColor, `${colors.pastelColor}00`]}
          />
        </AbsoluteVStack> */}
        <VStack
          className="ease-in-out"
          opacity={hideInfo ? 0 : 1}
          paddingHorizontal={size === 'xs' ? 30 : 20}
          paddingVertical={size === 'xs' ? 15 : 20}
          flex={1}
        >
          <HStack flex={1} width="100%" maxWidth="100%">
            {!!padTitleSide && !isSm && <VStack minWidth={10} flex={1} />}
            <VStack flexShrink={1} flex={10} alignItems="flex-end">
              <VStack position="relative">
                <Text
                  // not working below :(
                  className={size === 'xs' ? 'ellipse' : 'break-word'}
                  textAlign="right"
                  textShadowColor="#00000033"
                  textShadowRadius={2}
                  textShadowOffset={{ height: 2, width: 0 }}
                  fontWeight={size === 'sm' ? '700' : '800'}
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
    </CardFrame>
  )
}

const styles = StyleSheet.create({
  cardFrameSm: {
    position: 'absolute',
    width: widths.sm,
    height: heights.sm,
  },
  cardFrameMd: {
    position: 'absolute',
    width: widths.md,
    height: heights.md,
  },
})

export const CardOverlay = (props: { children: any }) => {
  return (
    <AbsoluteVStack
      fullscreen
      borderRadius={cardFrameBorderRadius}
      overflow="hidden"
      justifyContent="flex-end"
    >
      {/* <LinearGradient
        colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0)', 'rgba(0,0,0,0)', 'rgba(0,0,0,0.27)']}
        style={styles.cardFrameMd}
      /> */}
      <VStack padding={10} paddingTop={30} zIndex={10}>
        {props.children}
      </VStack>
    </AbsoluteVStack>
  )
}
