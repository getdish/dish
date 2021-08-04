import { Heart } from '@dish/react-feather'
import React from 'react'
import { Button, ButtonProps, Text, Tooltip, prevent } from 'snackui'

import { SmallButton } from './SmallButton'

export type FavoriteButtonProps = ButtonProps & {
  floating?: boolean
  isFavorite: boolean
  onToggle: () => void
  size?: 'lg' | 'md' | 'sm'
}

export const FavoriteButton = ({
  isFavorite,
  floating,
  onToggle,
  size = 'md',
  ...rest
}: FavoriteButtonProps) => {
  const sizePx = size === 'sm' ? 18 : size == 'lg' ? 26 : 22
  return (
    <Tooltip contents="Add to favorites">
      <SmallButton
        icon={
          <>
            {isFavorite && (
              <Text
                cursor="default"
                color="red"
                fontSize={sizePx * 0.9}
                width={sizePx * 0.7}
                height={sizePx * 0.7}
                lineHeight={sizePx * 0.5}
                marginTop={1}
                x={-1.5}
                y={2}
              >
                ♥️
              </Text>
            )}
            {!isFavorite && <Heart size={sizePx * 0.7} color={'#aaa'} />}
          </>
        }
        onPress={(e) => {
          prevent(e)
          onToggle?.()
        }}
        pressStyle={{
          opacity: 0.6,
        }}
        elevation={floating ? 1 : 0}
        {...rest}
      />
    </Tooltip>
  )
}
