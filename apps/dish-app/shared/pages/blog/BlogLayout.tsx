import { StackProps, VStack } from '@dish/ui'
import React from 'react'

import { PageContent } from '../../views/layout/PageContent'
import { PageFooter } from '../../views/layout/PageFooter'

export function BlogLayout({ children, ...props }: StackProps) {
  return (
    <>
      <PageContent>
        <VStack {...props}>{children}</VStack>
      </PageContent>
      <PageFooter />
    </>
  )
}
