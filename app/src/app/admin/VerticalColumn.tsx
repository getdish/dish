import { LoadingItems, StackProps, YStack } from '@dish/ui'
import { Suspense } from 'react'

import { ColumnHeader } from './ColumnHeader'

export const VerticalColumn = ({ children, title, ...props }: StackProps & { title?: any }) => {
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
