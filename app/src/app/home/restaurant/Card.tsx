import React from 'react'
import { StyleSheet } from 'react-native'
import {
  AbsoluteVStack,
  HStack,
  LinearGradient,
  Paragraph,
  Spacer,
  Text,
  VStack,
  useTheme,
} from 'snackui'

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
  hoverEffect?: 'scale' | 'background' | false
  size?: 'lg' | 'md' | 'sm' | 'xs'
  backgroundColor?: string | null
  borderColor?: string | null
  isBehind?: boolean
  dimImage?: boolean
  padTitleSide?: boolean
  square?: boolean
  colorsKey?: string
  variant?: 'flat'
  chromeless?: boolean
  borderless?: boolean
  afterTitle?: any
  className?: string
  floating?: boolean
}

const widths = {
  xs: 250,
  sm: cardFrameWidthSm,
  md: cardFrameWidth,
  lg: cardFrameWidth * 1.5,
}

const heights = {
  xs: 48,
  sm: cardFrameHeightSm,
  md: cardFrameHeight,
  lg: cardFrameHeight,
}

const scales = {
  xs: 0.6,
  sm: 0.85,
  md: 0.95,
  lg: 1,
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
  floating,
  subTitle,
  padTitleSide,
  aspectFixed,
  hoverEffect,
  hideInfo,
  square,
  chromeless,
  backgroundColor,
  isBehind,
  dimImage,
  borderless,
  className,
  afterTitle,
  variant,
  size = 'md',
}: CardProps) {
  const colors = backgroundColor
    ? getColorsForColor(backgroundColor)
    : typeof title === 'string'
    ? getColorsForName(colorsKey || title || '')
    : getColorsForName('')
  const isSm = size === 'sm'
  const width = widths[size]
  const height = square ? width : heights[size]
  const sizes = {
    width,
    height,
  }
  // const frame = {
  //   ...sizes,
  //   width: aspectFixed ? sizes.width : '100%',
  // }
  const strTitle = typeof title === 'string' ? title : 'hello world'
  const len = strTitle.length
  const lenScale = len > 50 ? 0.7 : len > 40 ? 0.8 : len > 30 ? 0.9 : 1
  const longestWordLen = getLongestWord(strTitle)
  const wordScale = longestWordLen > 14 ? 0.7 : longestWordLen > 9 ? 0.8 : 1
  const baseFontSize = 25 * lenScale * wordScale
  const fontSize = Math.round(baseFontSize * scales[size])
  const isFlat = variant === 'flat'
  const theme = useTheme()

  return (
    <CardFrame
      floating={floating}
      className={className}
      borderColor={borderColor}
      backgroundColor={backgroundColor}
      square={square}
      size={size}
      aspectFixed={aspectFixed}
      hoverEffect={hoverEffect}
      flat={isFlat}
      chromeless={chromeless}
      borderless={borderless}
    >
      {!!photo && (
        <AbsoluteVStack
          borderWidth={2}
          borderColor={theme.backgroundColorTransluscent}
          bottom="-3%"
          right="-3%"
          zIndex={10}
        >
          {typeof photo === 'string' ? (
            photo ? (
              <Image
                resizeMode="cover"
                {...sizes}
                style={{
                  borderRadius: 100,
                  width: sizes.height * 0.17,
                  height: sizes.height * 0.17,
                }}
                source={{ uri: photo }}
              />
            ) : null
          ) : (
            photo
          )}
        </AbsoluteVStack>
      )}

      {/* behind shadow */}
      {/* on native this causes laggy scrolls */}
      {!chromeless && isWeb && isBehind && (
        <AbsoluteVStack
          className="ease-in-out"
          opacity={hideInfo ? 0 : 1}
          zIndex={1002}
          borderRadius={isFlat ? 0 : cardFrameBorderRadius}
          fullscreen
          x={-cardFrameWidth}
          // this makes react native work...
          backgroundColor="rgba(0,0,0,0.1)"
          shadowColor={theme.shadowColor}
          shadowOpacity={0.5}
          shadowRadius={100}
          shadowOffset={{ width: 10, height: 0 }}
        />
      )}

      {typeof outside === 'function' ? outside(colors) : outside}

      <VStack
        className="safari-fix-overflow"
        fullscreen
        justifyContent="flex-end"
        pointerEvents="none"
        zIndex={11}
        borderRadius={isFlat ? 0 : cardFrameBorderRadius}
        overflow="hidden"
        width="100%"
        height="100%"
      >
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
                  textShadowColor={theme.shadowColor}
                  textShadowRadius={2}
                  textShadowOffset={{ height: 2, width: 0 }}
                  fontWeight={size === 'sm' ? '700' : '800'}
                  letterSpacing={size === 'sm' ? -1 : -0.5}
                  color={theme.color}
                  fontSize={fontSize}
                  numberOfLines={3}
                  lineHeight={fontSize * 1.1}
                  // flexShrink={0}
                >
                  {title} {!!afterTitle ? <Text fontWeight="300">{afterTitle}</Text> : null}
                </Text>
              </VStack>
              <Spacer size="xs" />
              {!!subTitle && size !== 'xs' && (
                <Paragraph
                  textAlign="right"
                  fontWeight="800"
                  textShadowColor={theme.shadowColor}
                  textShadowRadius={2}
                  textShadowOffset={{ height: 2, width: 0 }}
                >
                  {subTitle}
                </Paragraph>
              )}

              {typeof below === 'function' ? below(colors) : below}
            </VStack>
          </HStack>
        </VStack>
      </VStack>
    </CardFrame>
  )
}

export const CardOverlay = (props: { children: any; flat?: boolean }) => {
  return (
    <AbsoluteVStack
      fullscreen
      borderRadius={props.flat ? 0 : cardFrameBorderRadius}
      overflow="hidden"
      justifyContent="flex-end"
    >
      {!props.flat && (
        <LinearGradient
          colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0)', 'rgba(0,0,0,0.17)']}
          style={StyleSheet.absoluteFill}
        />
      )}
      <VStack flex={1} paddingHorizontal={14} paddingVertical={16} zIndex={10}>
        {props.children}
      </VStack>
    </AbsoluteVStack>
  )
}
