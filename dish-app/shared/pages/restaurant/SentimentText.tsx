import { Text, TextProps } from '@dish/ui'
import React from 'react'

import { lightGreen, lightGrey, lightRed } from '../../colors'
import { VoteNumber } from '../../hooks/useUserUpvoteDownvoteQuery'

export const SentimentText = ({
  sentiment,
  children,
  ...props
}: TextProps & { sentiment: VoteNumber }) => {
  return (
    <Text
      lineHeight={26}
      fontSize={14}
      color="rgba(0,0,0,0.7)"
      backgroundColor={
        sentiment > 0 ? lightGreen : sentiment < 0 ? lightRed : lightGrey
      }
      paddingHorizontal={4}
      borderRadius={6}
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
  )
}
