import { HStack, ProgressCircle, StackProps, Text, VStack } from '@dish/ui'
import React, { forwardRef } from 'react'

export type RatingViewProps = StackProps & {
  size: 'lg' | 'md' | 'sm' | 'xs'
  percent?: number
  color?: string
  hideEmoji?: boolean
  subtle?: boolean
}

export const getRankingColor = (percent: number) =>
  percent >= 0.8
    ? 'rgba(200, 260, 220, 0.85)'
    : percent >= 0.5
    ? '#C6BC1A'
    : 'rgba(250, 100, 100, 0.85)'

export const RatingView = forwardRef(
  (
    {
      color = 'red',
      percent = 0,
      subtle,
      size: sizeIn,
      hideEmoji,
      ...rest
    }: RatingViewProps,
    ref
  ) => {
    const borderColor = getRankingColor(percent)

    // size!
    let size =
      sizeIn == 'xs' ? 30 : sizeIn === 'sm' ? 40 : sizeIn == 'md' ? 48 : 72

    const badgeOffset =
      sizeIn === 'xs' || sizeIn === 'sm' ? Math.max(-size * 0.0025, -3) : 0

    const bgColor = 'rgba(255,255,255,0.3)'

    // const emoji = (
    //   <Text
    //     fontSize={Math.max(sizeIn === 'xs' ? 12 : 14, size * 0.4)}
    //     marginTop={size < 43 ? 0 : -size * 0.13}
    //     textShadowColor="rgba(0,0,0,0.25)"
    //     textShadowRadius={size * 0.015}
    //   >
    //     {percent >= 0.9 ? '♥️' : '⭐️'}
    //   </Text>
    // )

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
          fontWeight={subtle ? '300' : '700'}
          color={color}
          textAlign="center"
        >
          {rankingPre}
        </Text>
        {!!rankingPost && (
          <Text
            fontWeight="500"
            marginTop="25%"
            fontSize={size * 0.33}
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
          borderWidth={1}
          borderColor="rgba(0,0,0,0.05)"
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
        {/* {!hideEmoji && percent >= 7 && (
          <VStack
            position="absolute"
            top={badgeOffset * size}
            right={badgeOffset * size}
            alignItems="center"
            justifyContent="center"
            zIndex={100}
          >
            {emoji}
          </VStack>
        )} */}
        <VStack
          backgroundColor={bgColor}
          borderRadius={100}
          shadowColor={`rgba(0,0,0,${sizeIn == 'lg' ? 0.1 : 0.25})`}
          shadowRadius={size / 5}
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
            color={color}
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
          <VStack
            borderRadius={100}
            borderColor={borderColor}
            borderWidth={1 + (sizeIn == 'lg' ? 1 : 0)}
            width="100%"
            height="100%"
            position="absolute"
          />
        </VStack>
      </VStack>
    )
  }
)
