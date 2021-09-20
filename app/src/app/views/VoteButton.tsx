import React, { useState } from 'react'
import { AbsoluteVStack, StackProps, VStack, prevent, useMedia, useTheme } from 'snackui'

// TODO snackui advanced extraction case

export const VoteButton = ({
  color,
  Icon,
  size = 18,
  voted,
  shadowDirection,
  hoverColor,
  ...props
}: StackProps & {
  hoverColor?: string
  voted?: boolean
  Icon: any
  color?: string | null
  shadowDirection?: 'up' | 'down'
  size?: number
}) => {
  const media = useMedia()
  const theme = useTheme()
  const scale = (media.sm ? 1.1 : 1) * size * 0.0666
  const [hovered, setHovered] = useState(false)
  const isUp = shadowDirection === 'up'
  const translateDir = isUp ? -1 : 1
  return (
    <VStack
      position="relative"
      width={32 * scale}
      height={32 * scale}
      alignItems="center"
      justifyContent="center"
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      onPressIn={prevent}
      backgroundColor={theme.backgroundColor}
      borderRadius={100}
      borderColor={theme.backgroundColorSecondary}
      pressStyle={{
        backgroundColor: theme.backgroundColor,
      }}
      {...props}
    >
      <VStack
        opacity={voted ? 1 : 0.25}
        hoverStyle={{
          opacity: 1,
        }}
      >
        <Icon
          size={size * (voted ? 1.2 : 1)}
          color={!voted && hovered ? hoverColor ?? theme.colorSecondary : color ?? '#ccc'}
        />
      </VStack>
      <AbsoluteVStack
        top={translateDir * 8}
        left={-8}
        right={-8}
        bottom={-translateDir * 8}
        overflow="hidden"
      >
        <AbsoluteVStack
          top={0}
          bottom={0}
          left={10}
          right={10}
          borderRadius={1000}
          shadowColor="#000"
          shadowOpacity={0.15}
          shadowRadius={4}
          y={translateDir * -10}
        />
      </AbsoluteVStack>
    </VStack>
  )
}
