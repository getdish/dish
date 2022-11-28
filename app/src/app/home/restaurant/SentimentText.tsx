import { Spacer, Text, TextProps, XStack } from '@dish/ui'
import { ThumbsDown, ThumbsUp } from '@tamagui/lucide-icons'
import React from 'react'

export const SentimentText = ({
  sentiment,
  scale = 1,
  children,
  ...props
}: TextProps & { sentiment: number; scale?: number }) => {
  // have to wrap with XStack to get border radius on native
  const Icon = sentiment > 0 ? ThumbsUp : ThumbsDown
  const color = sentiment > 0 ? '$green9' : sentiment < 0 ? '$red9' : '$gray9'
  return (
    <XStack
      paddingHorizontal={6 * scale}
      borderRadius={6 * scale}
      alignItems="center"
      backgroundColor="$backgroundHover"
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
          <Spacer size="$1" />
        </>
      )}
      <Icon size={12 * scale} color={color} />
    </XStack>
  )
}
