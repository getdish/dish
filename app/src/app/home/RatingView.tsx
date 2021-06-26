import React from 'react'
import { AbsoluteVStack, HStack, Spacer, Text, VStack, useTheme } from 'snackui'

import { green, orange, purple, red, yellow } from '../../constants/colors'
import { numberFormat } from '../../helpers/numberFormat'
import { Pie } from '../views/Pie'
import { ProgressRing } from './ProgressRing'

export const RatingView = ({
  rating = 0,
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
  const width = size * 0.04
  const stackedSize = size * 0.85
  const innerSize = Math.round(stacked ? stackedSize : size * 0.33)
  const middleSize = Math.round(stacked ? stackedSize : size * 0.6)
  const outerSize = Math.round(stacked ? stackedSize : size * 0.85)

  const innerRing = (
    <>
      {/* <Pie color={purple} percent={ratingInner} size={innerSize} /> */}
      <ProgressRing
        backgroundColor="rgba(125,125,125,0.1)"
        percent={ratingInner}
        size={innerSize}
        color={purple}
        width={width}
      />
    </>
  )

  const middleRing = (
    <ProgressRing
      backgroundColor="rgba(125,125,125,0.1)"
      percent={ratingMiddle}
      size={middleSize}
      color={yellow}
      width={width}
    >
      {stacked ? null : innerRing}
    </ProgressRing>
  )

  const outerRing = (
    <ProgressRing
      backgroundColor="rgba(125,125,125,0.1)"
      percent={rating}
      size={outerSize}
      color={rating >= 80 ? green : rating <= 50 ? red : orange}
      width={width}
    >
      {stacked ? null : (
        <Text
          color={theme.color}
          letterSpacing={-0.13 * width}
          fontWeight="800"
          fontSize={7.5 * width}
        >
          {Math.min(99, Math.round(rating))}
        </Text>
      )}
    </ProgressRing>
  )

  if (!stacked) {
    return (
      <VStack
        alignItems="center"
        justifyContent="center"
        position="relative"
        borderRadius={1000}
        width={size}
        height={size}
        {...(floating && {
          backgroundColor: theme.backgroundColor,
          shadowColor: theme.shadowColor,
          shadowRadius: 5,
        })}
      >
        {/* <AbsoluteVStack zIndex={-1} opacity={0.5}>
          <Circle size={size} backgroundColor={theme.color} opacity={0.9} />
        </AbsoluteVStack> */}
        {outerRing}

        {typeof count !== 'undefined' && (
          <AbsoluteVStack
            zIndex={-1}
            top="-24%"
            right="-24%"
            width={size * 0.55}
            height={size * 0.55}
            borderRadius={100}
            justifyContent="center"
            alignItems="center"
            backgroundColor={theme.backgroundColor}
            shadowColor={theme.shadowColor}
            shadowRadius={5}
            shadowOffset={{ height: 2, width: 0 }}
          >
            <Text
              letterSpacing={-0.5}
              color={theme.color}
              opacity={0.75}
              fontWeight="800"
              fontSize={longText ? 12 : 14}
            >
              {countText}
            </Text>
          </AbsoluteVStack>
        )}
      </VStack>
    )
  }

  return (
    <HStack spacing="sm">
      <HStack display="inline-flex" alignItems="center">
        {outerRing}
        <Spacer size="xs" />
        <Text>
          Food
          <Text fontSize={13} marginHorizontal={5} opacity={0.5}>
            {Math.round(rating)}%
          </Text>
        </Text>
      </HStack>
      <HStack alignItems="center">
        {middleRing}
        <Spacer size="xs" />
        <Text>
          Service
          <Text fontSize={13} marginHorizontal={5} opacity={0.5}>
            {Math.round(ratingMiddle)}%
          </Text>
        </Text>
      </HStack>
      <HStack alignItems="center">
        {innerRing}
        <Spacer size="xs" />
        <Text>
          Ambience
          <Text fontSize={13} marginHorizontal={5} opacity={0.5}>
            {Math.round(ratingInner)}%
          </Text>
        </Text>
      </HStack>
      {typeof count !== 'undefined' && (
        <HStack alignItems="center">
          <VStack width={size} height={size} alignItems="center" justifyContent="center">
            <Text color={theme.color} opacity={0.5} fontWeight="600" fontSize={longText ? 10 : 12}>
              {countText}
            </Text>
          </VStack>
          <Spacer />
          <Text>Reviews</Text>
        </HStack>
      )}
    </HStack>
  )
}
