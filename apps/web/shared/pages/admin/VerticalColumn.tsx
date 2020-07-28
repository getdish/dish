import { LoadingItems, StackProps, VStack } from '@dish/ui'
import { Suspense } from 'react'

import { ColumnHeader } from './ColumnHeader'

export const VerticalColumn = ({
  children,
  title,
  ...props
}: StackProps & { title?: any }) => {
  return (
    <VStack
      minWidth={180}
      maxWidth={250}
      flex={1}
      borderLeftColor="#eee"
      borderLeftWidth={1}
      {...props}
    >
      {!!title && <ColumnHeader>{title}</ColumnHeader>}
      <Suspense fallback={<LoadingItems />}>{children}</Suspense>
    </VStack>
  )
}
