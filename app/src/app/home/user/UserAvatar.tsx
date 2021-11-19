import { Text, YStack, useTheme } from '@dish/ui'
import React, { memo } from 'react'

import { defaultUserImage } from '../../../constants/defaultUserImage'
import { Image } from '../../views/Image'
import { characters } from './characters'

export const UserAvatar = memo(
  ({
    size = 100,
    avatar,
    charIndex,
  }: {
    size?: number
    avatar?: string | null
    charIndex?: number | null
  }) => {
    const char = characters[charIndex ?? 0]
    const theme = useTheme()
    return (
      <YStack
        borderRadius={1000}
        backgroundColor={theme.backgroundColorSecondary}
        width={size}
        height={size}
        position="relative"
      >
        {!!avatar && (
          <Image
            source={{ uri: avatar || defaultUserImage }}
            style={{
              width: size,
              height: size,
              borderRadius: size,
            }}
          />
        )}
        {!avatar && (
          <YStack
            borderRadius={1000}
            backgroundColor={theme.backgroundColor}
            borderWidth={2}
            borderColor={theme.borderColor}
            width={size}
            height={size}
          />
        )}
        <Text position="absolute" bottom={0} right={0} fontSize={size * 0.33}>
          {char ?? '👻'}
        </Text>
      </YStack>
    )
  }
)
