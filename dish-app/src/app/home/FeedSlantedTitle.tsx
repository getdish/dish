import React from 'react'
import { VStack } from 'snackui'

import { SlantedTitle, SlantedTitleProps } from '../views/SlantedTitle'

export const FeedSlantedTitle = (props: SlantedTitleProps) => {
  return (
    <VStack
      alignSelf="flex-start"
      marginTop={0}
      marginLeft={15}
      marginBottom={-42}
    >
      <SlantedTitle size="md" {...props} />
    </VStack>
  )
}
