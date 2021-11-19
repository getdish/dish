import { Spacer, Text, TextProps, XStack, useTheme } from '@dish/ui'
import { ThumbsDown, ThumbsUp } from '@tamagui/feather-icons'
import React from 'react'

import { green200, grey, red200 } from '../../../constants/colors'

export const SentimentText = ({
  sentiment,
  scale = 1,
  children,
  ...props
}: TextProps & { sentiment: number; scale?: number }) => {
  // have to wrap with XStack to get border radius on native
  const Icon = sentiment > 0 ? ThumbsUp : ThumbsDown
  const theme = useTheme()
  const color = sentiment > 0 ? green200 : sentiment < 0 ? red200 : grey
  return (
    <XStack
      paddingHorizontal={6 * scale}
      borderRadius={6 * scale}
      alignItems="center"
      backgroundColor={theme.backgroundColorSecondary}
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
    </XStack>
  )
}
