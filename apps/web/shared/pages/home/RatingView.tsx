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
  percent >= 0.8 ? '#00BA00' : percent >= 0.5 ? 'blue' : 'red'

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
    const borderColor =
      percent >= 0.8
        ? 'rgba(190, 250, 200, 0.85)'
        : percent >= 0.5
        ? 'gold'
        : 'rgba(250, 100, 100, 0.85)'

    // size!
    const size =
      sizeIn == 'xs' ? 32 : sizeIn === 'sm' ? 42 : sizeIn == 'md' ? 48 : 76

    const badgeOffset =
      sizeIn === 'xs' || sizeIn === 'sm' ? Math.max(-size * 0.0025, -3) : 0

    const bgColor = 'rgba(255,255,255,0.3)'

    const emoji = (
      <Text
        fontSize={Math.max(sizeIn === 'xs' ? 12 : 14, size * 0.25)}
        textShadowColor="rgba(0,0,0,0.25)"
        textShadowRadius={size * 0.015}
      >
        {percent >= 0.9 ? '💎' : '⭐️'}
      </Text>
    )

    const ranking = Math.round(percent * 10)
    const rankingPre = Math.round(ranking / 10)
    const rankingPost =
      rankingPre === 10
        ? ''
        : `.${Math.round(((ranking / 10) % rankingPre) * 10)}`.slice(0, 2)
    const number = (
      <HStack>
        <Text
          fontSize={Math.max(12, size * 0.5)}
          fontWeight={subtle ? '300' : '700'}
          color={color}
          textAlign="center"
        >
          {rankingPre}
        </Text>
        {!!rankingPost && (
          <Text
            fontWeight="300"
            marginTop={1}
            fontSize={size * 0.4}
            opacity={(1 / size) * 20}
          >
            {rankingPost}
          </Text>
        )}
      </HStack>
    )

    if (subtle) {
      return (
        <HStack spacing={2} {...rest}>
          {/* {emoji} */}
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
            {emoji}
          </VStack>
        )}
        <VStack
          backgroundColor={bgColor}
          borderRadius={100}
          shadowColor={`rgba(0,0,0,${sizeIn == 'lg' ? 0.05 : 0.25})`}
          shadowRadius={size / 10}
          shadowOffset={{ height: 3, width: 0 }}
          width={size}
          height={size}
          alignItems="center"
          // justifyContent="center"
        >
          <ProgressCircle
            percent={percent * 10}
            radius={size * 0.5}
            borderWidth={size * 0.07}
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
