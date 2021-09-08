import React from 'react'
import { StackProps, VStack } from 'snackui'

export type ColumnProps = StackProps & { allowOverflow?: boolean }

export const Column = (props: ColumnProps) => {
  // const theme = useTheme()
  return (
    <VStack
      width={150}
      // borderLeftColor={theme.borderColor}
      // borderLeftWidth={2}
      height={46}
      alignItems="center"
      justifyContent="center"
      overflow="hidden"
      {...(props.allowOverflow && {
        overflow: 'visible',
      })}
      {...props}
    />
  )
}
