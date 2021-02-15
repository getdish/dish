import React from 'react'
import { AbsoluteVStack, HStack, Spacer, Text, VStack, useTheme } from 'snackui'

import { green, red, yellow } from '../../constants/colors'
import { numberFormat } from '../../helpers/numberFormat'
import { Pie } from '../views/Pie'
import { ProgressRing } from './ProgressRing'

export const RatingView = ({
  rating,
  count,
  size,
  floating,
  stacked,
}: {
  size: number
  rating: number
  count?: number
  floating?: boolean
  stacked?: boolean
}) => {
  const theme = useTheme()
  const countText = count ? `${numberFormat(count, 'sm')}` : null
  const longText = countText ? countText.length > 2 : false
  const ratingInner = rating * 0.7
  const ratingMiddle = rating * 0.5
  const rotate = `${(1 - ratingInner / 100) * 180}deg`
  const width = size * 0.1

  const innerRing = (
    <VStack transform={[{ rotate }]}>
      <Pie
        color={red}
        percent={ratingInner}
        size={stacked ? size * 0.66 : size * 0.33}
      />
    </VStack>
  )

  const middleRing = (
    <ProgressRing
      percent={ratingMiddle}
      size={stacked ? size * 0.8 : size * 0.6}
      color={yellow}
      width={width}
    >
      {stacked ? null : innerRing}
    </ProgressRing>
  )

  const outerRing = (
    <ProgressRing
      percent={rating}
      size={stacked ? size : size * 0.85}
      color={green}
      width={width}
    >
      {stacked ? null : middleRing}
    </ProgressRing>
  )

  if (!stacked) {
    return (
      <VStack
        alignItems="center"
        justifyContent="center"
        borderRadius={1000}
        width={size}
        height={size}
        {...(floating && {
          backgroundColor: theme.backgroundColor,
          shadowColor: theme.shadowColor,
          shadowRadius: 5,
        })}
      >
        {outerRing}
        {typeof count !== 'undefined' && (
          <AbsoluteVStack
            zIndex={-1}
            top="-15%"
            right="-15%"
            backgroundColor="#fff"
            width={size * 0.44}
            height={size * 0.44}
            borderRadius={100}
            alignItems="center"
            justifyContent="center"
          >
            <Text
              color={theme.color}
              opacity={0.5}
              fontWeight="600"
              fontSize={longText ? 10 : 12}
            >
              {countText}
            </Text>
          </AbsoluteVStack>
        )}
      </VStack>
    )
  }

  return (
    <VStack>
      <HStack alignItems="center">
        <VStack
          width={size}
          height={size}
          alignItems="center"
          justifyContent="center"
        >
          {outerRing}
        </VStack>
        <Spacer />
        <Text>
          Food
          <Text marginLeft={10} opacity={0.5}>
            {Math.round(rating)}%
          </Text>
        </Text>
      </HStack>
      <HStack alignItems="center">
        <VStack
          width={size}
          height={size}
          alignItems="center"
          justifyContent="center"
        >
          {middleRing}
        </VStack>
        <Spacer />
        <Text>
          Service
          <Text marginLeft={10} opacity={0.5}>
            {Math.round(ratingMiddle)}%
          </Text>
        </Text>
      </HStack>
      <HStack alignItems="center">
        <VStack
          width={size}
          height={size}
          alignItems="center"
          justifyContent="center"
        >
          {innerRing}
        </VStack>
        <Spacer />
        <Text>
          Ambience
          <Text marginLeft={10} opacity={0.5}>
            {Math.round(ratingInner)}%
          </Text>
        </Text>
      </HStack>
      {typeof count !== 'undefined' && (
        <HStack alignItems="center">
          <VStack
            width={size}
            height={size}
            alignItems="center"
            justifyContent="center"
          >
            <Text
              color={theme.color}
              opacity={0.5}
              fontWeight="600"
              fontSize={longText ? 10 : 12}
            >
              {countText}
            </Text>
          </VStack>
          <Spacer />
          <Text>Reviews</Text>
        </HStack>
      )}
    </VStack>
  )
}
