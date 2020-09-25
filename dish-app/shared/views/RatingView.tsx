import { HStack, ProgressCircle, StackProps, Text, VStack } from '@dish/ui'
import React, { forwardRef } from 'react'

export type RatingViewProps = StackProps & {
  size: 'lg' | 'md' | 'sm' | 'xs'
  percent?: number
  color?: string
  hideEmoji?: boolean
  hideDecimal?: boolean
  subtle?: boolean
}

const yellow = [0, 220, 220]
const green = [100, 255, 100]
const gray = [160, 160, 160]

export const getRankingColor = (percent: number) =>
  percent >= 0.8 ? green : percent >= 0.5 ? yellow : gray

export const RatingView = forwardRef(
  (
    {
      color = 'red',
      percent = 0,
      subtle,
      size: sizeIn,
      hideDecimal,
      hideEmoji,
      ...rest
    }: RatingViewProps,
    ref
  ) => {
    const borderColor = `rgb(${getRankingColor(percent)
      .map((x) => x + 40)
      .join(',')})`

    // size!
    let size =
      sizeIn == 'xs' ? 32 : sizeIn === 'sm' ? 38 : sizeIn == 'md' ? 48 : 64

    const badgeOffset =
      sizeIn === 'xs' || sizeIn === 'sm' ? Math.max(-size * 0.0025, -3) : 0

    const bgColor = 'rgba(255,255,255,0.3)'

    const ranking = percent * 10
    const rankingPre = Math.floor(ranking / 10)
    const rankingPost =
      rankingPre === 10 || ranking === 0
        ? ''
        : `.${Math.round(((ranking / 10) % rankingPre) * 10)}`.slice(0, 2)

    const number = (
      <HStack>
        <Text
          fontSize={Math.max(12, size * 0.65)}
          fontWeight={subtle ? '300' : '400'}
          color={color}
          textAlign="center"
        >
          {rankingPre}
        </Text>
        {!!rankingPost && !hideDecimal && (
          <Text
            fontWeight="500"
            marginTop="25%"
            fontSize={size * 0.25}
            letterSpacing={-1}
            opacity={(1 / size) * 10}
          >
            {rankingPost}
          </Text>
        )}
      </HStack>
    )

    if (subtle) {
      return (
        <HStack
          borderRadius={100}
          width={size}
          height={size}
          alignItems="center"
          justifyContent="center"
          {...rest}
        >
          {number}
        </HStack>
      )
    }

    return (
      <VStack
        // @ts-ignore
        ref={ref}
        position="relative"
        width={size}
        height={size}
        {...rest}
      >
        {!hideEmoji && percent >= 7 && (
          <VStack
            position="absolute"
            top={badgeOffset * size}
            right={badgeOffset * size}
            alignItems="center"
            justifyContent="center"
            zIndex={100}
          >
            <Text
              fontSize={Math.max(sizeIn === 'xs' ? 13 : 14, size * 0.4)}
              marginTop={size < 43 ? -size * 0.1 : -size * 0.13}
              textShadowColor="rgba(0,0,0,0.25)"
              textShadowRadius={size * 0.015}
            >
              {percent >= 0.9 ? '🥇' : '⭐️'}
            </Text>
          </VStack>
        )}
        <VStack
          borderRadius={100}
          shadowColor={`rgba(0,0,0,${sizeIn == 'lg' ? 0.1 : 0.2})`}
          shadowRadius={size / 7}
          shadowOffset={{ height: 5, width: 0 }}
          width={size}
          height={size}
          alignItems="center"
          // justifyContent="center"
        >
          <ProgressCircle
            percent={Math.max(Math.min(100, ranking), 0)}
            radius={size * 0.5}
            borderWidth={Math.max(1, size * 0.035)}
            color={borderColor}
          >
            <VStack
              width="100%"
              height="100%"
              borderRadius={100}
              backgroundColor={bgColor}
              alignItems="center"
              justifyContent="center"
            >
              {number}
            </VStack>
          </ProgressCircle>
        </VStack>
      </VStack>
    )
  }
)
