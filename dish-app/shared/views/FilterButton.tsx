import { Tag } from '@dish/graph'
import { Clock, DollarSign, ShoppingBag } from '@dish/react-feather'
import React, { memo } from 'react'
import { Image } from 'react-native'
import { Box, HStack, HoverablePopover, Text, VStack } from 'snackui'

import { useIsNarrow } from '../hooks/useIs'
import { tagDisplayNames } from '../state/tagMeta'
import { useOvermind } from '../state/useOvermind'
import { thirdPartyCrawlSources } from '../thirdPartyCrawlSources'
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
    const iconColor = isSmall ? (isActive ? '#000' : '#fff') : color
    const textColor = isSmall ? color : isActive ? '#000' : color

    let content: any =
      rest.children ?? (tag.name ? tagDisplayNames[tag.name] : null) ?? tag.name

    const iconElement = (() => {
      switch (tag.slug) {
        case 'filters__open':
          return <Clock size={18} color={iconColor} />
        case 'filters__delivery':
          return <ShoppingBag size={18} color={iconColor} />
        case 'filters__price-low':
          return <DollarSign size={18} color={iconColor} />
      }
    })()

    if (isSmall) {
      content = iconElement
    } else {
      content = (
        <Text
          color={textColor}
          fontSize={fontSize}
          fontWeight={fontWeight}
          lineHeight={lineHeight}
        >
          {content}
        </Text>
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
        borderColor={isSmall ? 'transparent' : '#eee'}
        fontSize={14}
        fontWeight="700"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        isActive={isActive}
        tag={tag}
        {...rest}
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
)

const SearchPageDeliveryFilterButtons = memo(() => {
  const om = useOvermind()
  const currentState = om.state.home.currentState
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
          const isActive = activeTags[key]
          return (
            <FilterButton
              tag={{
                name: key,
                type: 'filter',
                slug: item.tagSlug,
              }}
              key={key}
              isActive={noneActive ? true : isActive}
              width={200 - 10 * 2}
              borderRadius={100}
              cursor="pointer"
              alignItems="center"
              justifyContent="center"
            >
              <HStack spacing={6} alignItems="center">
                <Image
                  source={item.image}
                  style={{
                    width: 20,
                    height: 20,
                    marginVertical: -4,
                    borderRadius: 100,
                  }}
                />
                <Text fontSize={14} fontWeight="500">
                  {item.name}
                </Text>
              </HStack>
            </FilterButton>
          )
        })}
      </VStack>
    </Box>
  )
})
