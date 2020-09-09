import { StackProps, VStack } from '@dish/ui'
import { default as React } from 'react'
import { ChevronDown, ChevronUp, Minus } from 'react-feather'
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
  const Icon =
    trending == 'neutral' ? Minus : trending === 'up' ? ChevronUp : ChevronDown
  return (
    <VStack {...rest}>
      <Icon color={color} size={size} />
    </VStack>
  )
}
