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
  const width = size * 0.05
  const innerSize = Math.round(stacked ? size * 0.66 : size * 0.33)
  const middleSize = Math.round(stacked ? size * 0.8 : size * 0.6)
  const outerSize = Math.round(stacked ? size : size * 0.85)

  const innerRing = (
    <VStack rotate={rotate}>
      <Pie color={purple} percent={ratingInner} size={innerSize} />
    </VStack>
  )

  const middleRing = (
    <ProgressRing percent={ratingMiddle} size={middleSize} color={yellow} width={width}>
      {stacked ? null : innerRing}
    </ProgressRing>
  )

  const outerRing = (
    <ProgressRing
      percent={rating}
      size={outerSize}
      color={rating >= 80 ? green : rating <= 50 ? red : orange}
      width={width}
    >
      {/* {stacked ? null : middleRing} */}
      <Text
        color={theme.color}
        letterSpacing={-0.13 * width}
        fontWeight="800"
        fontSize={7.5 * width}
      >
        {Math.min(99, Math.round(rating))}
      </Text>
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
    <>
      <HStack display="inline-flex" alignItems="center">
        <VStack width={size} height={size} alignItems="center" justifyContent="center">
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
        <VStack width={size} height={size} alignItems="center" justifyContent="center">
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
        <VStack width={size} height={size} alignItems="center" justifyContent="center">
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
          <VStack width={size} height={size} alignItems="center" justifyContent="center">
            <Text color={theme.color} opacity={0.5} fontWeight="600" fontSize={longText ? 10 : 12}>
              {countText}
            </Text>
          </VStack>
          <Spacer />
          <Text>Reviews</Text>
        </HStack>
      )}
    </>
  )
}