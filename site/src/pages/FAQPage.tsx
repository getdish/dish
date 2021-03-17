import { Space } from '@o/ui'
import { mount, route } from 'navi'
import React from 'react'

import { Header } from '../Header'
import { ContentSection } from '../views/ContentSection'
import { SectionContent } from '../views/SectionContent'
import FAQPageContent from './FAQPage.mdx'

export default mount({
  '/': route({
    title: 'FAQ',
    view: <FAQPage />,
  }),
})

export function FAQPage() {
  return (
    <>
      <Header slim />
      <SectionContent>
        <Space size="xxl" />
        <ContentSection>
          <main>
            <FAQPageContent />
          </main>
        </ContentSection>
      </SectionContent>
    </>
  )
}

FAQPage.theme = 'light'
