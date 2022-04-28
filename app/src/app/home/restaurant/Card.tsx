import {
  cardFrameBorderRadius,
  cardFrameHeight,
  cardFrameHeightSm,
  cardFrameWidth,
  cardFrameWidthSm,
  isWeb,
} from '../../../constants/constants'
import { CardFrame, CardFrameProps } from '../../views/CardFrame'
import { Image } from '../../views/Image'
import {
  AbsoluteYStack,
  H3,
  Hoverable,
  HoverableProps,
  LinearGradient,
  Paragraph,
  Spacer,
  Text,
  XStack,
  YStack,
  useTheme,
} from '@dish/ui'
import React from 'react'
import { StyleSheet } from 'react-native'

export type CardProps = CardFrameProps &
  HoverableProps & {
    below?: (() => any) | JSX.Element | string | null
    outside?: (() => any) | JSX.Element | string | null
    photo?: string | JSX.Element | null
    title?: string | JSX.Element | null
    subTitle?: string | null
    hideInfo?: boolean
    isBehind?: boolean
    dimImage?: boolean
    padTitleSide?: boolean
    colorsKey?: string
    afterTitle?: any
    items?: any[]
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
  xxs: 0.5,
  xs: 0.6,
  sm: 0.85,
  md: 0.95,
  lg: 1,
}

const getLongestWord = (title: string) =>
  title?.split(' ').reduce((acc, cur) => Math.max(cur.length, acc), 0) ?? 0

export const getCardDimensions = (props: Partial<CardProps>) => {
  const width = widths[props.size || 'md']
  const height = props.square ? width : heights[props.size || 'md']
  return {
    width,
    height,
  }
}

export function Card(props: CardProps) {
  const {
    below,
    outside,
    photo,
    title = '',
    colorsKey,
    subTitle,
    padTitleSide,
    aspectFixed,
    hideInfo,
    isBehind,
    backgroundColor,
    dimImage,
    afterTitle,
    onHoverIn,
    items,
    onHoverOut,
    children,
    size = '$4',
    ...cardFrameProps
  } = props
  const hoverable = !!(onHoverIn || onHoverOut)
  const strTitle = typeof title === 'string' ? title : 'hello world'
  const len = strTitle.length
  const lenScale = len > 50 ? 0.7 : len > 40 ? 0.8 : len > 30 ? 0.9 : 1
  const longestWordLen = getLongestWord(strTitle)
  const wordScale = longestWordLen > 14 ? 0.7 : longestWordLen > 9 ? 0.8 : 1
  const baseFontSize = 25 * lenScale * wordScale
  const fontSize = Math.round(baseFontSize * scales[size])
  const theme = useTheme()

  const content = (
    <CardFrame size={size} {...cardFrameProps}>
      {/* {!!backgroundColor && (
        <AbsoluteYStack
          fullscreen
          className={
            (cardFrameProps.hoverEffect === 'background' ? 'hover-100-opacity-child ' : '') +
            ' chrome-fix-overflow safari-fix-overflow'
          }
          scale={1}
          overflow="hidden"
          borderRadius={cardFrameProps.flat ? 7 : cardFrameBorderRadius}
          backgroundColor={backgroundColor}
          {...(cardFrameProps.hoverEffect === 'background' && {
            opacity: 0.6,
          })}
        />
      )} */}

      {/* behind shadow */}
      {/* on native this causes laggy scrolls */}
      {!props.chromeless && isWeb && isBehind && (
        <AbsoluteYStack
          className="ease-in-out"
          opacity={hideInfo ? 0 : 1}
          zIndex={1002}
          borderRadius={props.flat ? 0 : cardFrameBorderRadius}
          fullscreen
          x={-cardFrameWidth}
          // this makes react native work...
          backgroundColor="rgba(0,0,0,0.1)"
        />
      )}

      {typeof outside === 'function' ? outside() : outside}

      <YStack
        className="safari-fix-overflow"
        fullscreen
        justifyContent="flex-end"
        pointerEvents="none"
        zIndex={11}
        borderRadius={props.flat ? 0 : cardFrameBorderRadius}
        overflow="hidden"
        width="100%"
        height="100%"
        position="relative"
      >
        {children ?? (
          <YStack
            className="ease-in-out"
            opacity={hideInfo ? 0 : 1}
            // @ts-ignore
            paddingHorizontal={size.endsWith('xs') ? 30 : 20}
            // @ts-ignore
            paddingVertical={size.endsWith('xs') ? 15 : 20}
            flex={1}
          >
            {typeof photo === 'string' && (
              <AbsoluteYStack
                opacity={0.15}
                pointerEvents="auto"
                zIndex={0}
                borderRadius={10}
                overflow="hidden"
                fullscreen
                hoverStyle={{
                  opacity: 0.7,
                }}
              >
                <Image source={{ uri: photo }} resizeMode="cover" style={StyleSheet.absoluteFill} />
                <AbsoluteYStack
                  fullscreen
                  alignItems="flex-start"
                  justifyContent="flex-end"
                  padding={10}
                  borderRadius={10}
                  overflow="hidden"
                >
                  <LinearGradient
                    style={[StyleSheet.absoluteFill, { zIndex: 0 }]}
                    start={[0, 1]}
                    end={[0, 0]}
                    colors={[`#000000`, `#00000000`]}
                  />
                </AbsoluteYStack>
              </AbsoluteYStack>
            )}
            <XStack alignItems="flex-end" flex={1} width="100%" maxWidth="100%">
              <YStack minWidth={10} flex={1} />
              <YStack flexShrink={1} flex={10} alignItems="flex-end">
                <YStack position="relative">
                  <H3 textAlign="right" fontSize={fontSize} lineHeight={fontSize * 1.1}>
                    {title} {!!afterTitle ? <Text fontWeight="300">{afterTitle}</Text> : null}
                  </H3>
                </YStack>
                <Spacer size="$1" />
                {!!subTitle && !size.endsWith('xs') && (
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

                {typeof below === 'function' ? below() : below}
              </YStack>
            </XStack>
          </YStack>
        )}
      </YStack>
    </CardFrame>
  )

  if (hoverable) {
    return (
      <Hoverable onHoverIn={onHoverIn} onHoverOut={onHoverOut}>
        {content}
      </Hoverable>
    )
  }

  return content
}

export const CardOverlay = (props: { children: any; flat?: boolean }) => {
  return (
    <AbsoluteYStack
      fullscreen
      borderRadius={props.flat ? 0 : cardFrameBorderRadius}
      overflow="hidden"
      justifyContent="flex-end"
    >
      {!props.flat && (
        <LinearGradient
          colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0)', 'rgba(0,0,0,0.05)']}
          style={StyleSheet.absoluteFill}
        />
      )}
      <YStack overflow="hidden" flex={1} paddingHorizontal={10} paddingVertical={10} zIndex={10}>
        {props.children}
      </YStack>
    </AbsoluteYStack>
  )
}
