import { YStack } from '@dish/ui'
import React from 'react'

import { Link } from '../views/Link'
import { LinkButtonNamedProps, LinkSharedProps } from '../views/LinkProps'
import { ScalingPressable } from '../views/ScalingPressable'
import { SlantedTitle, SlantedTitleProps } from '../views/SlantedTitle'

const TitleContainer = ({ children }: { children: any }) => {
  return (
    <YStack alignSelf="center" position="relative" zIndex={10}>
      {children}
    </YStack>
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
