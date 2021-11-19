import { Modal, Paragraph, Text, YStack } from '@dish/ui'
import React, { useState } from 'react'

import { CloseButton } from './CloseButton'
import { PaneControlButtons } from './PaneControlButtons'
import { SlantedTitle } from './SlantedTitle'

export function NotFoundPage(props: { title?: string }) {
  const [shown, setShown] = useState(true)

  return (
    <Modal visible={shown} onDismiss={() => setShown(false)} width={380}>
      <PaneControlButtons>
        <CloseButton onPress={() => setShown(false)} />
      </PaneControlButtons>

      <YStack alignItems="center" justifyContent="center">
        <SlantedTitle>{props.title ?? 'Not found!'} 😞</SlantedTitle>

        <Paragraph paddingVertical={40}>Uh oh! We're looking into it...</Paragraph>
      </YStack>
    </Modal>
  )
}
