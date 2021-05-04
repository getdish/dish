import { Heart, Star } from '@dish/react-feather'
import React from 'react'
import { useTheme } from 'snackui'
import { Button } from 'snackui'
import { HStack, Text, prevent } from 'snackui'

export type FavoriteButtonProps = {
  isFavorite: boolean
  onChange: (val: boolean) => void
  size?: 'lg' | 'md' | 'sm'
}

export const FavoriteButton = ({ isFavorite, onChange, size = 'md' }: FavoriteButtonProps) => {
  const sizePx = size === 'sm' ? 18 : size == 'lg' ? 26 : 22
  const theme = useTheme()
  return (
    <Button
      icon={
        <>
          {isFavorite && (
            <Text
              cursor="default"
              color="red"
              fontSize={sizePx * 0.5}
              lineHeight={sizePx * 0.5}
              marginTop={1}
            >
              ⭐️
            </Text>
          )}
          {!isFavorite && <Star size={sizePx * 0.7} color={'#aaa'} />}
        </>
      }
      tooltip="Add to favorites"
      onPress={(e) => {
        prevent(e)
        onChange?.(!isFavorite)
      }}
      pressStyle={{
        opacity: 0.6,
      }}
      shadowColor={theme.shadowColor}
      shadowOffset={{ height: 2, width: 0 }}
      shadowRadius={4}
    />
  )
}
