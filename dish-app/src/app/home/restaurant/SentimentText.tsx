import { ThumbsDown, ThumbsUp } from '@dish/react-feather'
import React from 'react'
import { HStack, Spacer, Text, TextProps, useTheme } from 'snackui'

import { green, grey, red } from '../../../constants/colors'

export const SentimentText = ({
  sentiment,
  scale = 1,
  children,
  ...props
}: TextProps & { sentiment: number; scale?: number }) => {
  // have to wrap with hstack to get border radius on native
  const Icon = sentiment > 0 ? ThumbsUp : ThumbsDown
  const theme = useTheme()
  const color = sentiment > 0 ? green : sentiment < 0 ? red : grey
  return (
    <HStack
      paddingHorizontal={4 * scale}
      borderRadius={6 * scale}
      alignItems="center"
      backgroundColor={theme.backgroundColorAlt}
    >
      {!!children && (
        <>
          <Text
            lineHeight={26}
            fontWeight="700"
            fontSize={14 * scale}
            color={color}
            ellipse
            {...props}
          >
            {children}
          </Text>
          <Spacer size="xs" />
        </>
      )}
      <Icon size={12 * scale} color={color} />
    </HStack>
  )
}
