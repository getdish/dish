import React from 'react'
import { VStack } from 'snackui'

import { Link } from '../views/Link'
import { LinkButtonNamedProps, LinkSharedProps } from '../views/LinkProps'
import { ScalingPressable } from '../views/ScalingPressable'
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

export const FeedSlantedTitleLink = ({
  tag,
  tags,
  name,
  params,
  ...props
}: SlantedTitleProps & LinkSharedProps & LinkButtonNamedProps) => {
  return (
    <VStack
      alignSelf="flex-start"
      marginTop={0}
      marginLeft={15}
      marginBottom={-42}
      position="relative"
      zIndex={10}
    >
      <ScalingPressable>
        <Link asyncClick {...{ tag, tags, name, params }}>
          <SlantedTitle size="md" {...props} />
        </Link>
      </ScalingPressable>
    </VStack>
  )
}
