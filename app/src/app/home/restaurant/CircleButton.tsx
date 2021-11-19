import { StackProps, YStack, useTheme } from '@dish/ui'
import React from 'react'

export const CircleButton = (props: StackProps & { floating?: boolean }) => {
  const theme = useTheme()
  return (
    <YStack
      borderRadius={1000}
      backgroundColor={theme.backgroundColorSecondary}
      width={44}
      height={44}
      alignItems="center"
      justifyContent="center"
      borderWidth={1}
      borderColor={theme.borderColor}
      hoverStyle={{
        borderColor: theme.borderColorHover,
        backgroundColor: theme.backgroundColorTertiary,
      }}
      {...(props.floating && {
        shadowColor: 'rgba(0,0,0,0.1)',
        shadowOffset: { height: 2, width: 0 },
        shadowRadius: 8,
      })}
      {...props}
    />
  )
}
