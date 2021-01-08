import React from 'react'
import { StackProps, VStack, useTheme } from 'snackui'

export const CircleButton = (props: StackProps) => {
  const theme = useTheme()
  return (
    <VStack
      borderRadius={1000}
      shadowColor="rgba(0,0,0,0.1)"
      backgroundColor={theme.backgroundColorTertiary}
      shadowRadius={8}
      width={38}
      height={38}
      alignItems="center"
      justifyContent="center"
      shadowOffset={{ height: 2, width: 0 }}
      borderWidth={1}
      borderColor="transparent"
      hoverStyle={{
        borderColor: '#aaa',
      }}
      {...props}
    />
  )
}
