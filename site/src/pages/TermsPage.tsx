import { Space } from '@o/ui'
import { mount, route } from 'navi'
import React from 'react'

import { Header } from '../Header'
import { ContentSection } from '../views/ContentSection'
import { SectionContent } from '../views/SectionContent'

// import TermsPageContent from './TermsPage.mdx'

export default mount({
  '/': route({
    title: 'Terms',
    view: <TermsPage />,
  }),
})

export function TermsPage() {
  return (
    <>
      <Header slim />
      <SectionContent>
        <Space size="xxl" />
        <ContentSection>
          <main>{/* <TermsPageContent /> */}</main>
        </ContentSection>
      </SectionContent>
      {/* <BlogFooter /> */}
    </>
  )
}

TermsPage.theme = 'light'
