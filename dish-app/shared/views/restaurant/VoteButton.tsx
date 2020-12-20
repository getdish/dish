import React, { useState } from 'react'
import { AbsoluteVStack, StackProps, VStack, prevent, useMedia } from 'snackui'

import { bgLight } from '../../colors'

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
  const scale = media.sm ? 1.1 : 1
  const [hovered, setHovered] = useState(false)
  const translateDir = shadowDirection === 'up' ? -1 : 1
  return (
    <VStack
      position="relative"
      width={22 * scale}
      height={22 * scale}
      borderRadius={100}
      alignItems="center"
      justifyContent="center"
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      onPressIn={prevent}
      backgroundColor="#fff"
      pressStyle={{
        backgroundColor: bgLight,
        borderColor: '#aaa',
      }}
      {...props}
    >
      <AbsoluteVStack
        top={0}
        left={-10}
        right={-10}
        bottom={0}
        transform={[{ translateY: translateDir * 10 }]}
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
          transform={[{ translateY: translateDir * -10 }]}
        />
      </AbsoluteVStack>
      <Icon
        size={size * (voted ? 1.2 : 1)}
        color={hovered ? hoverColor ?? '#000' : color ?? '#ccc'}
      />
    </VStack>
  )
}
