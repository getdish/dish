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
}: {
  size: number
  rating: number
  count?: number
  floating?: boolean
}) => {
  const theme = useTheme()
  const countText = count ? `${numberFormat(count, 'sm')}` : null
  const longText = countText ? countText.length > 2 : false
  const rotate = `${(1 - (rating * 0.7) / 100) * 180}deg`
  const width = size * 0.075
  return (
    <HStack
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
      <ProgressRing
        percent={rating}
        size={size * 0.85}
        color={green}
        width={width}
      >
        <ProgressRing
          percent={rating * 0.5}
          size={size * 0.6}
          color={yellow}
          width={width}
        >
          <VStack transform={[{ rotate }]}>
            <Pie color={red} percent={rating * 0.7} size={size * 0.3} />
          </VStack>
        </ProgressRing>
      </ProgressRing>

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
    </HStack>
  )
}
