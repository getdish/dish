import React, { memo } from 'react'
import { Circle } from 'snackui'
import { Text, VStack, useTheme } from 'snackui'

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
      <VStack
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
        {!avatar && <Circle backgroundColor={theme.backgroundColorDarker} size={size} />}
        <Text position="absolute" bottom={-size * 0.1} left={-size * 0.1} fontSize={size * 0.4}>
          {char ?? '👻'}
        </Text>
      </VStack>
    )
  }
)
