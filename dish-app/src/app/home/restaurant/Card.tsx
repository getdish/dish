import React from 'react'
import { Image, StyleSheet } from 'react-native'
import {
  AbsoluteVStack,
  Circle,
  HStack,
  LinearGradient,
  Paragraph,
  Spacer,
  StackProps,
  Text,
  VStack,
} from 'snackui'

import {
  cardFrameBorderRadius,
  cardFrameHeight,
  cardFrameHeightSm,
  cardFrameWidth,
  cardFrameWidthSm,
} from '../../../constants/constants'
import {
  ColorShades,
  getColorsForColor,
  getColorsForName,
} from '../../../helpers/getColorsForName'
import { CardFrame } from '../../views/CardFrame'

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
  square?: boolean
  colorsKey?: string
}

export function Card({
  below,
  outside,
  photo,
  title,
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
  size,
}: CardProps) {
  const colors = backgroundColor
    ? getColorsForColor(backgroundColor)
    : getColorsForName(colorsKey || title || '')
  const underColor = `${colors.pastelColor}99`
  const overColor = colors.color
  const isSm = size === 'sm'
  const width = isSm ? cardFrameWidthSm : cardFrameWidth
  const height = square ? width : isSm ? cardFrameHeightSm : cardFrameHeight
  const sizes = {
    width,
    height,
  }
  const frame = {
    ...sizes,
    width: aspectFixed ? sizes.width : '100%',
  }
  const longestWord =
    title?.split(' ').reduce((acc, cur) => Math.max(cur.length, acc), 0) ?? 0
  const fontSize = Math.round((longestWord > 9 ? 24 : 28) * (isSm ? 0.85 : 1))

  return (
    <CardFrame
      square={square}
      size={size}
      aspectFixed={aspectFixed}
      hoverable={hoverable}
    >
      <VStack
        borderRadius={cardFrameBorderRadius}
        backgroundColor={colors.pastelColor}
        width="100%"
        height="100%"
      >
        <VStack
          className="hover-parent safari-fix-overflow"
          pointerEvents="auto"
          width="100%"
          overflow="hidden"
          alignSelf="center"
          position="relative"
          borderRadius={cardFrameBorderRadius}
          backgroundColor={backgroundColor || underColor || ''}
        >
          <AbsoluteVStack
            className="ease-in-out"
            opacity={hideInfo ? 0 : 1}
            fullscreen
            zIndex={12}
          >
            <VStack flex={1}>
              <AbsoluteVStack
                zIndex={1001}
                borderRadius={cardFrameBorderRadius}
                top={0}
                left={0}
                bottom={0}
                right="60%"
                transform={[{ translateX: -20 }]}
              >
                <LinearGradient
                  pointerEvents="none"
                  style={[
                    StyleSheet.absoluteFill,
                    { opacity: isBehind ? 0.6 : 0 },
                  ]}
                  start={[0, 0]}
                  end={[1, 0]}
                  colors={['rgba(0,0,0,1)', 'rgba(0,0,0,0)']}
                />
              </AbsoluteVStack>
            </VStack>
          </AbsoluteVStack>
          <VStack
            className="hover-75-opacity-child"
            opacity={dimImage ? 0.5 : 0.9}
            {...frame}
          >
            {!!photo && typeof photo === 'string' ? (
              <Image
                resizeMode="cover"
                {...sizes}
                style={frame}
                source={{ uri: photo }}
              />
            ) : (
              photo
            )}
          </VStack>
        </VStack>

        {typeof outside === 'function' ? outside(colors) : outside}

        <AbsoluteVStack
          alignItems="flex-start"
          fullscreen
          justifyContent="flex-end"
          pointerEvents="none"
          zIndex={11}
          borderRadius={cardFrameBorderRadius}
          overflow="hidden"
        >
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
              <VStack
                className="hover-bubble-title-child"
                flex={1}
                alignItems="flex-end"
              >
                <VStack position="relative">
                  <AbsoluteVStack
                    className="hover-0-opacity-child"
                    zIndex={-1}
                    left={-60}
                    bottom={-60}
                    transform={[
                      { rotate: '20deg' },
                      { scaleX: 1.5 },
                      { translateY: -30 },
                    ]}
                  >
                    <LinearGradient
                      style={{ width: 220, height: 220 }}
                      colors={[
                        colors.pastelColor,
                        colors.pastelColor,
                        colors.pastelColor,
                        colors.pastelColor,
                        `${colors.color}00`,
                        // `transparent`,
                        // `transparent`,
                      ]}
                      // start={[1, 0]}
                      // end={[0.9, 0.1]}
                    />
                  </AbsoluteVStack>

                  <Text
                    textAlign="right"
                    textShadowColor="#00000033"
                    textShadowRadius={4}
                    textShadowOffset={{ height: 2, width: 0 }}
                    fontWeight="800"
                    letterSpacing={-0.5}
                    color="#fff"
                    fontSize={fontSize}
                    lineHeight={fontSize * 1.05}
                  >
                    {title}
                  </Text>
                </VStack>
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
      </VStack>
    </CardFrame>
  )
}

export const CardOverlay = (props: StackProps) => {
  return (
    <AbsoluteVStack
      fullscreen
      top="auto"
      justifyContent="flex-end"
      borderBottomLeftRadius={cardFrameBorderRadius}
      borderBottomRightRadius={cardFrameBorderRadius}
      overflow="hidden"
      {...props}
    />
  )
}
