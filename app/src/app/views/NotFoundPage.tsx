import React, { useState } from 'react'
import { Modal, Paragraph, Text, VStack } from 'snackui'

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

      <VStack alignItems="center" justifyContent="center">
        <SlantedTitle>{props.title ?? 'Not found!'} 😞</SlantedTitle>

        <Paragraph paddingVertical={40}>Uh oh! We're looking into it...</Paragraph>
      </VStack>
    </Modal>
  )
}
