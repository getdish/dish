import { StackProps, YStack } from '@dish/ui'
import { ChevronDown, ChevronUp, Minus } from '@tamagui/feather-icons'
import React from 'react'
export const TrendingIcon = ({
  trending,
  color = trending === 'up' ? 'green' : '#ff559999',
  size,
  ...rest
}: StackProps & {
  color?: string
  size?: number
  trending?: 'up' | 'down' | 'neutral'
}) => {
  const Icon = trending == 'neutral' ? Minus : trending === 'up' ? ChevronUp : ChevronDown
  return (
    <YStack {...rest}>
      <Icon color={color} size={size} />
    </YStack>
  )
}
