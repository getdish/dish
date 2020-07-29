import { HStack, Text, prevent } from '@dish/ui'
import React from 'react'
import { Heart } from 'react-feather'

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
  const sizePx = size === 'sm' ? 16 : size == 'lg' ? 26 : 18
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
      backgroundColor="#fff"
      borderRadius={100}
      borderWidth={1}
      borderColor={size === 'md' ? 'transparent' : '#eee'}
      hoverStyle={{
        borderColor: size === 'md' ? 'transparent' : '#aaa',
      }}
    >
      {isFavorite && (
        <Text color="red" fontSize={sizePx * 0.88} lineHeight={sizePx * 0.88}>
          ♥️
        </Text>
      )}
      {!isFavorite && <Heart size={sizePx * 0.7} color={'#aaa'} />}
    </HStack>
  )
}
