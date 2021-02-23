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
          className="safari-fix-overflow"
          pointerEvents="auto"
          width="100%"
          overflow="hidden"
          alignSelf="center"
          position="relative"
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
              backgroundColor="red"
              transform={[{ translateX: -cardFrameWidth }]}
              shadowColor="#000"
              shadowRadius={50}
              shadowOffset={{ width: 10, height: 0 }}
            />
          )}
          <VStack
            className="hover-75-opacity-child mask-image"
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
          {/* bottom color gradient */}
          <AbsoluteVStack
            className="hover-0-opacity-child ease-in-out"
            zIndex={-2}
            left={0}
            bottom={0}
            top="0%"
            right={-20}
            opacity={1}
            transform={[
              { rotate: '45deg' },
              { scaleX: 2 },
              { translateY: 30 },
              { translateY: 30 },
            ]}
          >
            <LinearGradient
              style={StyleSheet.absoluteFill}
              colors={['transparent', `${colors.altColor}00`, colors.altColor]}
            />
          </AbsoluteVStack>

          <VStack
            className="ease-in-out"
            opacity={hideInfo ? 0 : 1}
            padding={20}
            alignItems="flex-start"
            spacing
            width="100%"
            height="100%"
            contain="strict"
          >
            <HStack width="100%">
              {!!padTitleSide &&
                (isSm ? (
                  <VStack minWidth={30} flex={1} />
                ) : (
                  <VStack minWidth={45} flex={1} />
                ))}
              <VStack flex={1} alignItems="flex-end">
                <VStack position="relative">
                  <AbsoluteVStack
                    className="hover-50-opacity-child ease-in-out-slow"
                    zIndex={-1}
                    left={-90}
                    bottom={-90}
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
                        `${colors.color}00`,
                      ]}
                    />
                  </AbsoluteVStack>

                  <Text
                    textAlign="right"
                    textShadowColor="#00000033"
                    textShadowRadius={4}
                    textShadowOffset={{ height: 2, width: 0 }}
                    fontWeight="800"
                    letterSpacing={-1}
                    color="#fff"
                    fontSize={fontSize}
                    lineHeight={fontSize}
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
        <AbsoluteVStack left={0} right={0} bottom={0} top={-30}>
          <LinearGradient
            colors={['rgba(0,0,0,0)', '#000']}
            style={StyleSheet.absoluteFill}
          />
        </AbsoluteVStack>
        <VStack padding={10}>{props.children}</VStack>
      </VStack>
    </AbsoluteVStack>
  )
}
