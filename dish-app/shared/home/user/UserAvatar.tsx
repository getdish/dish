import React, { memo } from 'react'
import { Image } from 'react-native'
import { Text, VStack } from 'snackui'

import { defaultUserImage } from '../../constants/defaultUserImage'
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
    return (
      <VStack position="relative">
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
          bottom={-size * 0.15}
          left={-size * 0.15}
          fontSize={size * 0.5}
        >
          {char ?? '👻'}
        </Text>
      </VStack>
    )
  }
)
