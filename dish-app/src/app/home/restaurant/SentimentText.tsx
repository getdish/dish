import { ThumbsDown, ThumbsUp } from '@dish/react-feather'
import React from 'react'
import { HStack, Spacer, Text, TextProps } from 'snackui'

import { green, grey, red } from '../../../constants/colors'

export const SentimentText = ({
  sentiment,
  scale = 1,
  children,
  ...props
}: TextProps & { sentiment: number; scale?: number }) => {
  // have to wrap with hstack to get border radius on native
  const Icon = sentiment > 0 ? ThumbsUp : ThumbsDown
  return (
    <HStack
      backgroundColor={sentiment > 0 ? green : sentiment < 0 ? red : grey}
      paddingHorizontal={4 * scale}
      borderRadius={6 * scale}
      alignItems="center"
    >
      {!!children && (
        <>
          <Text
            lineHeight={26}
            fontWeight="700"
            fontSize={14 * scale}
            color="#fff"
            ellipse
            {...props}
          >
            {children}
          </Text>
          <Spacer size="xs" />
        </>
      )}
      <Icon size={12 * scale} color="#fff" />
    </HStack>
  )
}
