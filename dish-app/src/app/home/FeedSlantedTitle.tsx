import React from 'react'
import { VStack } from 'snackui'

import { Link } from '../views/Link'
import { LinkButtonNamedProps, LinkSharedProps } from '../views/LinkProps'
import { ScalingPressable } from '../views/ScalingPressable'
import { SlantedTitle, SlantedTitleProps } from '../views/SlantedTitle'

const TitleContainer = ({ children }: { children: any }) => {
  return (
    <VStack alignSelf="center" position="relative" zIndex={10}>
      {children}
    </VStack>
  )
}

export const FeedSlantedTitle = (props: SlantedTitleProps) => {
  return (
    <TitleContainer>
      <SlantedTitle size="lg" fontWeight="400" {...props} />
    </TitleContainer>
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
    <TitleContainer>
      <ScalingPressable>
        <Link asyncClick {...{ tag, tags, name, params }}>
          <SlantedTitle size="sm" fontWeight="600" {...props} />
        </Link>
      </ScalingPressable>
    </TitleContainer>
  )
}
