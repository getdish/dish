import React from 'react'
import { Paragraph, UnorderedList, UnorderedListItem, VStack } from 'snackui'

import { HomeStateItemAbout } from '../../../types/homeTypes'
import { ContentScrollView } from '../../views/ContentScrollView'
import { StackDrawer } from '../../views/StackDrawer'
import { StackItemProps } from '../HomeStackView'

export default function RoadmapPage({ item, isActive }: StackItemProps<HomeStateItemAbout>) {
  return (
    <StackDrawer closable title="Roadmap">
      <ContentScrollView id="roadmap">
        <VStack spacing="xl">
          <VStack paddingHorizontal="5%" spacing="xxl">
            <VStack />

            <Paragraph fontWeight="800" size={4} sizeLineHeight={0.66}>
              Roadmap
            </Paragraph>

            <Paragraph size="xl">Vote on things you want to see done.</Paragraph>

            <UnorderedList>
              <UnorderedListItem size="xl"></UnorderedListItem>
            </UnorderedList>
          </VStack>
        </VStack>
      </ContentScrollView>
    </StackDrawer>
  )
}
