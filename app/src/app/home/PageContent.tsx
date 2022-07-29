import { searchBarHeight } from '../../constants/constants'
import { isTouchDevice } from '../../constants/platforms'
import { getWindowHeight } from '../../helpers/getWindow'
import { PageFooter } from './PageFooter'
import { LoadingItems, YStack, YStackProps, isWeb } from '@dish/ui'
import React, { Suspense } from 'react'

export const PageContent = ({
  children,
  hideFooter,
  ...props
}: YStackProps & {
  hideFooter?: boolean
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
        {children}
      </Suspense>
      <YStack height={40} />

      {!isTouchDevice && !hideFooter && <PageFooter />}
    </YStack>
  )
}
