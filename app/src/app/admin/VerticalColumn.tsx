import { ColumnHeader } from './ColumnHeader'
import { LoadingItems, YStack, YStackProps } from '@dish/ui'
import React from 'react'
import { Suspense } from 'react'

export const VerticalColumn = ({ children, title, ...props }: YStackProps & { title?: any }) => {
  return (
    <YStack
      minWidth={180}
      maxWidth={250}
      height="100%"
      flex={1}
      borderRightColor="#ddd"
      borderRightWidth={1}
      {...props}
    >
      {!!title && <ColumnHeader>{title}</ColumnHeader>}
      <Suspense fallback={<LoadingItems />}>{children}</Suspense>
    </YStack>
  )
}
