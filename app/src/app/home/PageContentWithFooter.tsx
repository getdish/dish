import { searchBarHeight } from '../../constants/constants'
import { getWindowHeight } from '../../helpers/getWindow'
import { PageFooter } from './PageFooter'
import { LoadingItems, YStack, YStackProps } from '@dish/ui'
// @ts-ignore
import React, { Suspense, SuspenseList, SuspenseListProps } from 'react'

export const PageContentWithFooter = ({
  children,
  suspenseOrder,
  ...props
}: YStackProps & {
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
