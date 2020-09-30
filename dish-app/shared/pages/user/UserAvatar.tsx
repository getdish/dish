import { Text, VStack } from '@dish/ui'
import React, { memo } from 'react'
import { Image } from 'react-native'

import { defaultUserImage } from '../../defaultUserImage'
import { characters } from './characters'

export const UserAvatar = memo(
  ({ avatar, charIndex }: { avatar: string; charIndex: number }) => {
    const char = characters[charIndex]
    return (
      <VStack position="relative">
        <Image
          source={{ uri: avatar || defaultUserImage }}
          style={{
            width: 100,
            height: 100,
            borderRadius: 100,
          }}
        />
        <Text position="absolute" bottom={-15} left={-15} fontSize={50}>
          {char ?? '👻'}
        </Text>
      </VStack>
    )
  }
)
