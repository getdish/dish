import { Heart, Star } from '@dish/react-feather'
import React from 'react'
import { HStack, Text, prevent } from 'snackui'

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
          fontSize={sizePx * 0.7}
          lineHeight={sizePx * 0.7}
          marginTop={1}
        >
          ⭐️
        </Text>
      )}
      {!isFavorite && <Star size={sizePx * 0.7} color={'#aaa'} />}
    </HStack>
  )
}
