import { StackProps, YStack } from '@dish/ui'
import React from 'react'

export type ColumnProps = StackProps & { allowOverflow?: boolean }

export const Column = (props: ColumnProps) => {
  // const theme = useTheme()
  return (
    <YStack
      width={150}
      // borderLeftColor={theme.borderColor}
      // borderLeftWidth={2}
      height={54}
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
