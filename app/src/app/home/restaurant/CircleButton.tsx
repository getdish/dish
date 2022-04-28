import { YStack, YStackProps, useTheme } from '@dish/ui'
import React from 'react'

export const CircleButton = (props: YStackProps & { floating?: boolean }) => {
  const theme = useTheme()
  return (
    <YStack
      borderRadius={1000}
      backgroundColor="$backgroundHover"
      width={44}
      height={44}
      alignItems="center"
      justifyContent="center"
      borderWidth={1}
      borderColor="$borderColor"
      hoverStyle={{
        borderColor: '$borderColorHover',
        backgroundColor: '$backgroundPress',
      }}
      {...(props.floating && {
        elevation: '$2',
      })}
      {...props}
    />
  )
}
