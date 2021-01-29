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
  size,
}: {
  below?: string | null
  outside?: any
  photo?: string | JSX.Element | null
  title?: string | null
  subTitle?: string | null
  hideInfo?: boolean
  aspectFixed?: boolean
  hoverable?: boolean
  size?: 'sm' | 'md'
  backgroundColor?: string | null
  isBehind?: boolean
  padTitleSide?: boolean
}) {
  const { color, darkColor } = backgroundColor
    ? getColorsForColor(backgroundColor)
    : getColorsForName(title ?? '')
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
  const fontSize = longestWord > 9 ? 24 : 28

  return (
    <CardFrame size={size} aspectFixed={aspectFixed} hoverable={hoverable}>
      <VStack
        className="safari-fix-overflow"
        width="100%"
        overflow="hidden"
        alignSelf="center"
        position="relative"
        borderRadius={cardFrameBorderRadius}
        backgroundColor={backgroundColor ?? '#000' ?? ''}
      >
        <AbsoluteVStack
          className="ease-in-out"
          opacity={hideInfo ? 0 : 1}
          pointerEvents="none"
          fullscreen
          zIndex={10}
        >
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
        <VStack {...frame}>
          {!!photo && typeof photo === 'string' ? (
            <Image
              resizeMode="cover"
              {...sizes}
              style={{
                ...frame,
                opacity: 0.66,
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
        {outside}

        {isBehind && (
          <LinearGradient
            style={[StyleSheet.absoluteFill, sheet.cardGradient]}
            start={[0, 0]}
            end={[1, 0]}
            colors={['rgba(0,0,0,0.25)', 'rgba(0,0,0,0)']}
          />
        )}

        <VStack
          className="ease-in-out"
          opacity={hideInfo ? 0 : 1}
          padding={15}
          alignItems="flex-start"
          spacing
          width="100%"
          height="100%"
        >
          <HStack width="100%">
            {!!(outside || padTitleSide) && <VStack minWidth={50} flex={1} />}
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
                lineHeight={fontSize * 1.3}
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
          {below}
        </VStack>
      </AbsoluteVStack>
    </CardFrame>
  )
}

const sheet = StyleSheet.create({
  cardGradient: {
    zIndex: 11,
    borderRadius: cardFrameBorderRadius,
    right: '50%',
  },
})
