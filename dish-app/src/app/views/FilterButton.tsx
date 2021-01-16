import { Clock, DollarSign, ShoppingBag } from '@dish/react-feather'
import React from 'react'
import { HStack, HoverablePopover, VStack, useMedia, useTheme } from 'snackui'

import { tagDisplayNames } from '../../constants/tagMeta'
import { NavigableTag } from '../../types/tagTypes'
import { SearchPageDeliveryFilterButtons } from './SearchPageDeliveryFilterButtons'
import { SmallButton, SmallButtonProps } from './SmallButton'

type FilterButtonProps = SmallButtonProps & {
  tag: NavigableTag
}

export const FilterButton = ({
  tag,
  color,
  ...rest
}: FilterButtonProps & {
  color?: string
}) => {
  const media = useMedia()
  const theme = useTheme()
  const iconColor = media.sm ? theme.color : color

  let content: any =
    rest.children ?? (tag.name ? tagDisplayNames[tag.name] : null) ?? tag.name

  const iconElement = (() => {
    switch (tag.slug) {
      case 'filters__open':
        return <Clock size={media.sm ? 22 : 18} color={iconColor} />
      case 'filters__delivery':
        return <ShoppingBag size={media.sm ? 22 : 18} color={iconColor} />
      case 'filters__price-low':
      case 'filters__price-mid':
      case 'filters__price-high':
        if (media.sm) {
          return <DollarSign size={media.sm ? 22 : 18} color={iconColor} />
        }
        return null
      default:
        return null
    }
  })()

  if (media.sm) {
    content = iconElement
  } else {
    if (tag.name !== 'price-low') {
      content = (
        <HStack>
          {media.sm ? (
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
      tag={tag}
      {...rest}
      {...(media.sm && {
        padding: 0,
        height: 44,
        width: 52,
        noTextWrap: true,
        alignItems: 'center',
        justifyContent: 'center',
      })}
      textProps={{
        // color,
        fontWeight: '600',
        ...rest.textProps,
      }}
    >
      {content}
    </SmallButton>
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
