import React from 'react'
import { StackProps, VStack, useTheme } from 'snackui'

export const CircleButton = (props: StackProps) => {
  const theme = useTheme()
  return (
    <VStack
      borderRadius={1000}
      shadowColor="rgba(0,0,0,0.1)"
      backgroundColor={theme.backgroundColorSecondary}
      shadowRadius={8}
      width={44}
      height={44}
      alignItems="center"
      justifyContent="center"
      shadowOffset={{ height: 2, width: 0 }}
      borderWidth={1}
      borderColor={theme.borderColor}
      hoverStyle={{
        borderColor: theme.borderColorHover,
        backgroundColor: theme.backgroundColorTertiary,
      }}
      {...props}
    />
  )
}
