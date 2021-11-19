import { LoadingItems, StackProps, YStack } from '@dish/ui'
import React, { Suspense, SuspenseList, SuspenseListProps, SuspenseProps } from 'react'

import { searchBarHeight } from '../../constants/constants'
import { getWindowHeight } from '../../helpers/getWindow'
import { PageFooter } from './PageFooter'

export const PageContentWithFooter = ({
  children,
  suspenseOrder,
  ...props
}: StackProps & {
  suspenseOrder?: SuspenseListProps['revealOrder']
}) => {
  return (
    <YStack minHeight={Math.min(250, getWindowHeight() * 1 - searchBarHeight)} {...props}>
      <Suspense
        fallback={
          <>
            <LoadingItems />
            <LoadingItems />
          </>
        }
      >
        {suspenseOrder ? (
          <SuspenseList revealOrder={suspenseOrder}>{children}</SuspenseList>
        ) : (
          children
        )}
      </Suspense>
      <YStack height={40} />
      <PageFooter />
    </YStack>
  )
}
