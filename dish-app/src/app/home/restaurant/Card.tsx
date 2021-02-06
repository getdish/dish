import React from 'react'
import { Image, StyleSheet } from 'react-native'
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
  ColorShades,
  getColorsForColor,
  getColorsForName,
} from '../../../helpers/getColorsForName'
import {
  CardFrame,
  cardFrameBorderRadius,
  cardFrameHeight,
  cardFrameHeightSm,
  cardFrameWidth,
  cardFrameWidthSm,
} from '../../views/CardFrame'

export type CardProps = {
  below?: ((colors: ColorShades) => any) | JSX.Element | string | null
  outside?: ((colors: ColorShades) => any) | JSX.Element | string | null
  photo?: string | JSX.Element | null
  title?: string | null
  subTitle?: string | null
  hideInfo?: boolean
  aspectFixed?: boolean
  hoverable?: boolean
  size?: 'sm' | 'md'
  backgroundColor?: string | null
  isBehind?: boolean
  dimImage?: boolean
  padTitleSide?: boolean
}

export function Card({
  below,
  outside,
  photo,
  title,
  subTitle,
  padTitleSide,
  aspectFixed,
  hoverable,
  hideInfo,
  backgroundColor,
  isBehind,
  dimImage,
  size,
}: CardProps) {
  const colors = backgroundColor
    ? getColorsForColor(backgroundColor)
    : getColorsForName(title ?? '')
  const { color, darkColor } = colors
  const isSm = size === 'sm'
  const sizes = {
    width: isSm ? cardFrameWidthSm : cardFrameWidth,
    height: isSm ? cardFrameHeightSm : cardFrameHeight,
  }
  const frame = {
    ...sizes,
    width: aspectFixed ? sizes.width : '100%',
  }

  const topCornerColor = `${color}cc`
  const longestWord =
    title?.split(' ').reduce((acc, cur) => Math.max(cur.length, acc), 0) ?? 0
  const fontSize = Math.round((longestWord > 9 ? 24 : 28) * (isSm ? 0.85 : 0.9))

  return (
    <CardFrame size={size} aspectFixed={aspectFixed} hoverable={hoverable}>
      <VStack
        className="card-hover safari-fix-overflow"
        width="100%"
        overflow="hidden"
        alignSelf="center"
        position="relative"
        borderRadius={cardFrameBorderRadius}
        backgroundColor={backgroundColor ?? color ?? ''}
      >
        <AbsoluteVStack
          className="ease-in-out"
          opacity={hideInfo ? 0 : 1}
          fullscreen
          zIndex={12}
        >
          <VStack className="card-hover-fade" flex={1}>
            {isBehind && (
              <LinearGradient
                style={[StyleSheet.absoluteFill, sheet.cardGradient]}
                start={[0, 0]}
                end={[1, 0]}
                colors={['rgba(0,0,0,0.33)', 'rgba(0,0,0,0)']}
              />
            )}
            <LinearGradient
              style={StyleSheet.absoluteFill}
              colors={[
                `transparent`,
                `transparent`,
                'transparent',
                `${darkColor}aa`,
              ]}
              start={[1, 0]}
              end={[0, 0.5]}
            />
          </VStack>
          <LinearGradient
            style={[StyleSheet.absoluteFill, { opacity: 0.85 }]}
            colors={[
              topCornerColor,
              topCornerColor,
              `${color}00`,
              `transparent`,
              `transparent`,
            ]}
            start={[1, 0]}
            end={[0.9, 0.1]}
          />
        </AbsoluteVStack>
        <VStack className="card-image" {...frame}>
          {!!photo && typeof photo === 'string' ? (
            <Image
              resizeMode="cover"
              {...sizes}
              style={{
                ...frame,
                opacity: dimImage ? 0.5 : 1,
              }}
              source={{ uri: photo }}
            />
          ) : (
            photo
          )}
        </VStack>
      </VStack>
      <AbsoluteVStack
        alignItems="flex-start"
        fullscreen
        justifyContent="flex-end"
        pointerEvents="none"
        zIndex={11}
      >
        {typeof outside === 'function' ? outside(colors) : outside}

        <VStack
          className="ease-in-out"
          opacity={hideInfo ? 0 : 1}
          padding={20}
          alignItems="flex-start"
          spacing
          width="100%"
          height="100%"
        >
          <HStack width="100%">
            {!!padTitleSide &&
              (isSm ? (
                <VStack minWidth={30} flex={1} />
              ) : (
                <VStack minWidth={45} flex={1} />
              ))}
            <VStack flex={1} overflow="hidden" alignItems="flex-end">
              <Text
                textAlign="right"
                textShadowColor="#00000033"
                textShadowRadius={2}
                textShadowOffset={{ height: 2, width: 0 }}
                fontWeight="800"
                letterSpacing={-0.5}
                color="#fff"
                fontSize={fontSize}
                lineHeight={fontSize * 1.1}
              >
                {title}
              </Text>
              <Spacer size="xs" />
              {!!subTitle && (
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
          <VStack flex={1} />
          {typeof below === 'function' ? below(colors) : below}
        </VStack>
      </AbsoluteVStack>
    </CardFrame>
  )
}

const sheet = StyleSheet.create({
  cardGradient: {
    zIndex: 1001,
    borderRadius: cardFrameBorderRadius,
    right: '50%',
  },
})
