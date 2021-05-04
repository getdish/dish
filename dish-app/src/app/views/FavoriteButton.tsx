import { Heart, Star } from '@dish/react-feather'
import React from 'react'
import { Tooltip } from 'snackui'
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
  return (
    <Tooltip contents="Add to favorites">
      <Button
        icon={
          <>
            {isFavorite && (
              <Text
                cursor="default"
                color="red"
                fontSize={sizePx * 0.5}
                width={sizePx * 0.7}
                height={sizePx * 0.7}
                lineHeight={sizePx * 0.5}
                marginTop={1}
              >
                ⭐️
              </Text>
            )}
            {!isFavorite && <Star size={sizePx * 0.7} color={'#aaa'} />}
          </>
        }
        onPress={(e) => {
          prevent(e)
          onChange?.(!isFavorite)
        }}
        pressStyle={{
          opacity: 0.6,
        }}
        elevation={1}
      />
    </Tooltip>
  )
}
