import React from 'react'
import { HStack, Text, TextProps } from 'snackui'

import {
  green,
  grey,
  lightGreen,
  lightGrey,
  lightRed,
  red,
} from '../../../constants/colors'

export const SentimentText = ({
  sentiment,
  children,
  ...props
}: TextProps & { sentiment: number }) => {
  // have to wrap with hstack to get border radius on native
  return (
    <HStack
      backgroundColor={sentiment > 0 ? green : sentiment < 0 ? red : grey}
      paddingHorizontal={4}
      borderRadius={6}
    >
      <Text
        lineHeight={26}
        fontSize={14}
        color="rgba(0,0,0,0.7)"
        ellipse
        {...props}
      >
        {children}
      </Text>
    </HStack>
  )
}
