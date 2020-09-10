import { Heart } from '@dish/react-feather'
import { HStack, Text, prevent } from '@dish/ui'
import React from 'react'

export type FavoriteButtonProps = {
  isFavorite: boolean
  onChange: (val: boolean) => void
  size?: 'lg' | 'md' | 'sm'
}

export const FavoriteButton = ({
  isFavorite,
  onChange,
  size = 'md',
}: FavoriteButtonProps) => {
  const sizePx = size === 'sm' ? 18 : size == 'lg' ? 26 : 22
  return (
    <HStack
      pressStyle={{ opacity: 0.4 }}
      pointerEvents="auto"
      // @ts-ignore
      userSelect="none"
      onPress={(e) => {
        prevent(e)
        onChange?.(!isFavorite)
      }}
      height={sizePx * 1.4}
      width={sizePx * 1.4}
      alignItems="center"
      justifyContent="center"
      cursor="pointer"
    >
      {isFavorite && (
        <Text
          cursor="default"
          color="red"
          fontSize={sizePx * 0.8}
          lineHeight={sizePx * 0.8}
          marginTop={1}
        >
          ♥️
        </Text>
      )}
      {!isFavorite && <Heart size={sizePx * 0.7} color={'#aaa'} />}
    </HStack>
  )
}
