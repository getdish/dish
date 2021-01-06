import { Clock, DollarSign, ShoppingBag } from '@dish/react-feather'
import React, { memo } from 'react'
import { Image } from 'react-native'
import {
  Box,
  HStack,
  HoverablePopover,
  Theme,
  VStack,
  useMedia,
  useTheme,
} from 'snackui'

import { tagDisplayNames } from '../../constants/tagMeta'
import { thirdPartyCrawlSources } from '../../constants/thirdPartyCrawlSources'
import { NavigableTag } from '../../types/tagTypes'
import { useHomeStore } from '../homeStore'
import { SmallButton, SmallButtonProps } from './SmallButton'

type FilterButtonProps = SmallButtonProps & {
  tag: NavigableTag
}

export const FilterButton = memo((props: FilterButtonProps) => {
  const contents = <FilterButtonContents {...props} />
  if (props.isActive) {
    return <Theme name="active">{contents}</Theme>
  }
  return contents
})

const FilterButtonContents = ({
  tag,
  color,
  ...rest
}: SmallButtonProps & {
  tag: NavigableTag
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
        return <DollarSign size={media.sm ? 22 : 18} color={iconColor} />
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
      textProps={{
        // color,
        fontWeight: '600',
        ...rest.textProps,
        color: rest.isActive ? theme.color : rest.textProps?.color,
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

const SearchPageDeliveryFilterButtons = memo(() => {
  const home = useHomeStore()
  const currentState = home.currentState
  if (currentState.type !== 'search') {
    return null
  }
  const { activeTags } = currentState
  const sources = Object.keys(thirdPartyCrawlSources).filter(
    (key) => thirdPartyCrawlSources[key].delivery
  )
  const noneActive = sources.every((x) => !activeTags[x])
  return (
    <Box pointerEvents="auto" width={200}>
      <VStack spacing={4} padding={10} alignItems="stretch">
        {sources.map((key) => {
          const item = thirdPartyCrawlSources[key]
          const isActive = noneActive ? true : activeTags[key]
          return (
            <Theme key={key} name={isActive ? 'active' : null}>
              <FilterButton
                tag={{
                  name: key,
                  type: 'filter',
                  slug: item.tagSlug,
                }}
                width={200 - 10 * 2}
                borderRadius={100}
                icon={
                  <Image
                    source={item.image}
                    style={{
                      width: 20,
                      height: 20,
                      marginVertical: -4,
                      borderRadius: 100,
                    }}
                  />
                }
              >
                {item.name}
              </FilterButton>
            </Theme>
          )
        })}
      </VStack>
    </Box>
  )
})
