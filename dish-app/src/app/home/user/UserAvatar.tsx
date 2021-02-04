import React, { memo } from 'react'
import { Image } from 'react-native'
import { Text, VStack, useTheme } from 'snackui'

import { defaultUserImage } from '../../../constants/defaultUserImage'
import { characters } from './characters'

export const UserAvatar = memo(
  ({
    size = 100,
    avatar,
    charIndex,
  }: {
    size?: number
    avatar: string
    charIndex: number
  }) => {
    const char = characters[charIndex]
    const theme = useTheme()
    return (
      <VStack
        borderRadius={1000}
        backgroundColor={theme.backgroundColorSecondary}
        position="relative"
      >
        <Image
          source={{ uri: avatar || defaultUserImage }}
          style={{
            width: size,
            height: size,
            borderRadius: size,
          }}
        />
        <Text
          position="absolute"
          bottom={-size * 0.1}
          left={-size * 0.1}
          fontSize={size * 0.4}
        >
          {char ?? '👻'}
        </Text>
      </VStack>
    )
  }
)
