import React from 'react'
import { HStack, Text, TextProps } from 'snackui'

import { lightGreen, lightGrey, lightRed } from '../../../constants/colors'

export const SentimentText = ({
  sentiment,
  children,
  ...props
}: TextProps & { sentiment: number }) => {
  // have to wrap with hstack to get border radius on native
  return (
    <HStack
      backgroundColor={
        sentiment > 0 ? lightGreen : sentiment < 0 ? lightRed : lightGrey
      }
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
        {children}{' '}
        {(sentiment > 0 || sentiment < 0) && (
          <Text fontSize={11}>
            {sentiment > 0 ? '+' : ''}
            {Math.round(sentiment)}
          </Text>
        )}
      </Text>
    </HStack>
  )
}
