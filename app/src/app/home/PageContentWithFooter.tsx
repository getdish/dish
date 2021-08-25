import React, { Suspense } from 'react'
import { LoadingItems, StackProps, VStack } from 'snackui'

import { searchBarHeight } from '../../constants/constants'
import { getWindowHeight } from '../../helpers/getWindow'
import { PageFooter } from './PageFooter'

export const PageContentWithFooter = ({ children, ...props }: StackProps) => {
  return (
    <VStack minHeight={Math.min(250, getWindowHeight() * 1 - searchBarHeight)} {...props}>
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
      <VStack height={40} />
      <PageFooter />
    </VStack>
  )
}
