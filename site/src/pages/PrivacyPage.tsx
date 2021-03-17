import { Space } from '@o/ui'
import { mount, route } from 'navi'
import React from 'react'

import { Header } from '../Header'
import { ContentSection } from '../views/ContentSection'
import { SectionContent } from '../views/SectionContent'
import PrivacyPageContent from './PrivacyPage.mdx'

export default mount({
  '/': route({
    title: 'Privacy',
    view: <PrivacyPage />,
  }),
})

export function PrivacyPage() {
  return (
    <>
      <Header slim />
      <SectionContent>
        <Space size="xxl" />
        <ContentSection>
          <main>
            <PrivacyPageContent />
          </main>
        </ContentSection>
      </SectionContent>
      <BlogFooter />
    </>
  )
}

PrivacyPage.theme = 'light'
