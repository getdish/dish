import { ButtonProps, prevent, Text } from '@dish/ui'
import { Heart } from '@tamagui/feather-icons'
import React from 'react'
import { light } from '../../constants/colors'
import { SmallButton } from './SmallButton'

export type FavoriteButtonProps = Omit<ButtonProps, 'size'> & {
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
  children,
  ...rest
}: FavoriteButtonProps) => {
  const sizePx = size === 'sm' ? 18 : size == 'lg' ? 26 : 22
  return (
    <SmallButton
      tooltip="Add to favorites"
      size={size === 'sm' ? '$3' : '$4'}
      icon={
        isFavorite ? (
          <Text
            cursor="default"
            color={light.red9}
            fontSize={sizePx * 0.65}
            width={sizePx * 0.5}
            height={sizePx * 0.5}
            lineHeight={sizePx * 0.5}
            // marginTop={1}
            // x={-1.5}
            // y={2}
          >
            ♥️
          </Text>
        ) : (
          Heart
        )
      }
      onPress={(e) => {
        prevent(e)
        onToggle?.()
      }}
      pressStyle={{
        opacity: 0.6,
      }}
      elevation={floating ? '$1' : undefined}
      {...rest}
    >
      {typeof children === 'number' ? `${children}` : children}
    </SmallButton>
  )
}
