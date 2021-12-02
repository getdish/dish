import { ButtonProps, getFontSize, getFontSizeToken, Paragraph, prevent, Text } from '@dish/ui'
import { Heart } from '@tamagui/feather-icons'
import React from 'react'
import { light } from '../../constants/colors'
import { SmallButton } from './SmallButton'

export type FavoriteButtonProps = ButtonProps & {
  floating?: boolean
  isFavorite: boolean
  onToggle: () => void
}

export const FavoriteButton = ({
  isFavorite,
  floating,
  onToggle,
  size = '$4',
  children,
  ...rest
}: FavoriteButtonProps) => {
  return (
    <SmallButton
      tooltip="Add to favorites"
      size={size}
      icon={
        isFavorite ? (
          <Paragraph
            size={getFontSizeToken(size, { relativeSize: -2 })}
            cursor="default"
            color={light.red9}
            // marginTop={1}
            // x={-1.5}
            // y={2}
          >
            ♥️
          </Paragraph>
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
