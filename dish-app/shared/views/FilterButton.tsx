import { Tag } from '@dish/graph'
import { Clock, DollarSign, ShoppingBag } from '@dish/react-feather'
import { HStack, HoverablePopover, Spacer, VStack } from '@dish/ui'
import React, { memo } from 'react'

import { isWeb } from '../constants'
import { useIsNarrow } from '../hooks/useIs'
import { SearchPageDeliveryFilterButtons } from '../pages/search/SearchPageDeliveryFilterButtons'
import { tagDisplayNames } from '../state/tagDisplayName'
import { LinkButton } from './ui/LinkButton'
import { LinkButtonProps } from './ui/LinkProps'
import { SmallButton } from './ui/SmallButton'

export const FilterButton = memo(
  ({
    tag,
    isActive,
    zIndex,
    position,
    margin,
    flex,
    ...rest
  }: LinkButtonProps & { tag: Tag; isActive: boolean }) => {
    const isSmall = useIsNarrow()
    let content: any = rest.children ?? tagDisplayNames[tag.name] ?? tag.name

    const iconElement = (() => {
      switch (tag.name) {
        case 'Open':
          return <Clock size={18} />
        case 'Delivery':
          return <ShoppingBag size={18} />
        case 'price-low':
          return <DollarSign size={18} />
      }
    })()

    if (isSmall) {
      content = iconElement
    } else {
      if (tag.name !== 'price-low') {
        content = (
          <HStack>
            {iconElement}
            <Spacer size="xs" />
            {content}
          </HStack>
        )
      } else {
        content = <>{content}</>
      }
    }

    content = (
      <LinkButton {...{ zIndex, flex, position, margin }} tag={tag}>
        <SmallButton
          backgroundColor="transparent"
          fontSize={14}
          fontWeight="700"
          isActive={isActive}
          flex={flex}
          {...rest}
        >
          {isWeb ? (
            content
          ) : (
            <VStack transform={[{ translateY: 7 }]}>{content}</VStack>
          )}
        </SmallButton>
      </LinkButton>
    )

    if (tag.name === 'Delivery') {
      return (
        <HoverablePopover
          noArrow
          allowHoverOnContent
          contents={<SearchPageDeliveryFilterButtons />}
        >
          {content}
        </HoverablePopover>
      )
    }

    return content
  }
)
