import { Suspense } from 'react'
import { LoadingItems, VStack } from 'snackui'

import { searchBarHeight } from '../../constants/constants'
import { getWindowHeight } from '../../helpers/getWindow'
import { PageFooter } from './PageFooter'

export const PageContentWithFooter = ({ children }: { children?: any }) => {
  return (
    <>
      <VStack minHeight={getWindowHeight() * 1 - searchBarHeight}>
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
