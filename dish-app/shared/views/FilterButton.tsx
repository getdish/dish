import { Tag } from '@dish/graph'
import { Clock, DollarSign, ShoppingBag } from '@dish/react-feather'
import { HStack, HoverablePopover, Spacer, Text, VStack } from '@dish/ui'
import React, { memo } from 'react'

import { isWeb } from '../constants'
import { useIsNarrow } from '../hooks/useIs'
import { SearchPageDeliveryFilterButtons } from '../pages/search/SearchPageDeliveryFilterButtons'
import { tagDisplayNames } from '../state/tagDisplayName'
import { LinkButtonProps } from './ui/LinkProps'
import { SmallButton } from './ui/SmallButton'

export const FilterButton = memo(
  ({
    tag,
    isActive,
    color,
    fontSize,
    fontWeight = '500',
    lineHeight,
    ...rest
  }: LinkButtonProps & { tag: Tag; isActive: boolean; color?: string }) => {
    const isSmall = useIsNarrow()
    let content: any = rest.children ?? tagDisplayNames[tag.name] ?? tag.name

    const iconElement = (() => {
      switch (tag.name) {
        case 'Open':
          return <Clock size={18} color={color} />
        case 'Delivery':
          return <ShoppingBag size={18} color={color} />
        case 'price-low':
          return <DollarSign size={18} color={color} />
      }
    })()

    if (isSmall) {
      content = iconElement
    } else {
      content = (
        <Text {...{ color, fontSize, fontWeight, lineHeight }}>{content}</Text>
      )

      if (tag.name !== 'price-low') {
        content = (
          <HStack>
            {isSmall ? (
              iconElement
            ) : iconElement ? (
              <VStack opacity={0.45} marginRight={6}>
                {iconElement}
              </VStack>
            ) : null}
            {content}
          </HStack>
        )
      }
    }

    content = (
      <SmallButton
        backgroundColor="transparent"
        fontSize={14}
        fontWeight="700"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        isActive={isActive}
        tag={tag}
        {...rest}
      >
        {isWeb ? (
          content
        ) : (
          <VStack transform={[{ translateY: 7 }]}>{content}</VStack>
        )}
      </SmallButton>
    )

    if (tag.name === 'Delivery') {
      return (
        <HoverablePopover
          noArrow
          allowHoverOnContent
          contents={<SearchPageDeliveryFilterButtons {...rest} />}
        >
          {content}
        </HoverablePopover>
      )
    }

    return content
  }
)
