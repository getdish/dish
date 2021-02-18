import { Suspense } from 'react'
import { LoadingItems, VStack } from 'snackui'

import { PageFooter } from './PageFooter'

export const PageContentWithFooter = ({ children }: { children: any }) => {
  return (
    <>
      <VStack minHeight={600}>
        <Suspense
          fallback={
            <>
              <LoadingItems />
              <LoadingItems />
            </>
          }
        >
          {children}
        </Suspense>
      </VStack>
      <VStack height={40} />
      <PageFooter />
    </>
  )
}
