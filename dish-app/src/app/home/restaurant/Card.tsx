import React from 'react'
import { Image, StyleSheet } from 'react-native'
import {
  AbsoluteVStack,
  HStack,
  LinearGradient,
  Paragraph,
  Spacer,
  VStack,
  useTheme,
} from 'snackui'

import { getColorsForName } from '../../../helpers/getColorsForName'
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
  aspectFixed,
  hoverable,
  hideInfo,
  backgroundColor,
  size,
}: {
  below?: string
  outside?: any
  photo?: string | JSX.Element
  title: string
  subTitle?: string
  hideInfo?: boolean
  aspectFixed?: boolean
  hoverable?: boolean
  size?: 'sm' | 'md'
  backgroundColor?: string
}) {
  // const theme = useTheme()
  const { altPastelColor, pastelColor, lightColor, color } = getColorsForName(
    title ?? ''
  )

  const isSm = size === 'sm'
  const sizes = {
    width: isSm ? cardFrameWidthSm : cardFrameWidth,
    height: isSm ? cardFrameHeightSm : cardFrameHeight,
  }
  const frame = {
    ...sizes,
    width: aspectFixed ? sizes.width : '100%',
  }

  return (
    <CardFrame size={size} aspectFixed={aspectFixed} hoverable={hoverable}>
      <VStack
        className="safari-fix-overflow"
        width="100%"
        overflow="hidden"
        alignSelf="center"
        position="relative"
        borderRadius={cardFrameBorderRadius}
        backgroundColor={backgroundColor}
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
              `${altPastelColor}00`,
              `${color}00`,
              `${color}00`,
              altPastelColor,
            ]}
            start={[1, 0]}
            end={[0, 1]}
          />
          <LinearGradient
            style={[StyleSheet.absoluteFill, { opacity: 0.85 }]}
            colors={[
              color,
              pastelColor,
              `${pastelColor}00`,
              `${pastelColor}00`,
              `${pastelColor}00`,
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
                opacity: 0.5,
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
        zIndex={10}
      >
        {outside}

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
            {!!outside && <VStack minWidth={60} flex={1} />}
            <VStack flex={1} overflow="hidden" alignItems="flex-end">
              <Paragraph
                textAlign="right"
                size="xxl"
                sizeLineHeight={0.7}
                textShadowColor="#00000011"
                textShadowRadius={1}
                textShadowOffset={{ height: 2, width: 0 }}
                color="#fff"
                fontWeight="800"
                letterSpacing={-0.5}
              >
                {title}
              </Paragraph>
              <Spacer size="xs" />
              {!!subTitle && (
                <Paragraph textAlign="right" color="#fff" fontWeight="500">
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
