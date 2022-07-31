import { AbsoluteYStack, YStack, YStackProps, prevent, useMedia, useTheme } from '@dish/ui'
import React, { forwardRef, useState } from 'react'

export type VoteButtonProps = YStackProps & {
  hoverColor?: string
  voted?: boolean
  Icon: any
  color?: string | null
  shadowDirection?: 'up' | 'down'
  size?: number
}

export const VoteButton = forwardRef(
  (
    { color, Icon, size = 18, voted, shadowDirection, hoverColor, ...props }: VoteButtonProps,
    ref
  ) => {
    const media = useMedia()
    const theme = useTheme()
    const scale = (media.sm ? 1.1 : 1) * size * 0.0666
    const [hovered, setHovered] = useState(false)
    const isUp = shadowDirection === 'up'
    const translateDir = isUp ? -1 : 1
    return (
      <YStack
        ref={ref as any}
        position="relative"
        width={32 * scale}
        height={32 * scale}
        alignItems="center"
        justifyContent="center"
        onHoverIn={() => setHovered(true)}
        onHoverOut={() => setHovered(false)}
        onPress={prevent}
        backgroundColor="$background"
        borderRadius={100}
        borderColor="$borderColor"
        pressStyle={{
          backgroundColor: '$background',
        }}
        {...props}
      >
        <YStack
          opacity={voted ? 1 : 0.5}
          hoverStyle={{
            opacity: 1,
          }}
        >
          <Icon
            size={size * (voted ? 1.2 : 1)}
            color={!voted && hovered ? hoverColor ?? theme.colorHover : color ?? '#ccc'}
          />
        </YStack>
        <AbsoluteYStack
          top={translateDir * 8}
          left={-8}
          right={-8}
          bottom={-translateDir * 8}
          overflow="hidden"
        >
          <AbsoluteYStack
            top={0}
            bottom={0}
            left={10}
            right={10}
            borderRadius={1000}
            boc="$borderColor"
            bw={1}
            y={translateDir * -10}
          />
        </AbsoluteYStack>
      </YStack>
    )
  }
)
