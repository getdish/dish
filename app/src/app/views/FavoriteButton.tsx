import { SmallButton } from './SmallButton'
import { ButtonProps, Paragraph, Text, getFontSize, getFontSizeToken, prevent } from '@dish/ui'
import { Heart } from '@tamagui/feather-icons'
import React from 'react'

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
            size={getFontSizeToken(size as any, { relativeSize: -2 }) || undefined}
            cursor="default"
            color="$red9"
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
