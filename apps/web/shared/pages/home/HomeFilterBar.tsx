import {
  Box,
  HStack,
  HoverablePopover,
  StackProps,
  Text,
  VStack,
} from '@dish/ui'
import _ from 'lodash'
import React, { memo } from 'react'
import { CheckBox, Image } from 'react-native'

import { HomeActiveTagIds } from '../../state/home'
import { Tag, getTagId, tagDisplayNames } from '../../state/Tag'
import { useOvermind } from '../../state/useOvermind'
import { LinkButton } from '../../views/ui/LinkButton'
import { SmallButton } from '../../views/ui/SmallButton'
import { thirdPartyCrawlSources } from './thirdPartyCrawlSources'

export default memo(({ activeTagIds }: { activeTagIds: HomeActiveTagIds }) => {
  const height = 29
  const om = useOvermind()

  let last = 0
  const grouped = _.groupBy(
    om.state.home.allFilterTags,
    (x) => x?.['groupId'] ?? ++last
  )
  const groupedList = Object.keys(grouped).map((k) => grouped[k])

  return (
    <HStack alignItems="center" spacing={4} justifyContent="center">
      {groupedList.map((group, index) => {
        return (
          <HStack key={index} borderRadius={100}>
            {group.map((tag, groupIndex) => {
              const hasPrev = !!group[groupIndex - 1]
              const hasNext = !!group[groupIndex + 1]
              const extraProps: StackProps = {}
              extraProps.borderTopLeftRadius = hasPrev ? 0 : 30
              extraProps.borderBottomLeftRadius = hasPrev ? 0 : 30
              extraProps.borderTopRightRadius = hasNext ? 0 : 30
              extraProps.borderBottomRightRadius = hasNext ? 0 : 30
              const button = (
                <FilterButton
                  key={`tag-${tag.id}`}
                  filter={tag}
                  isActive={activeTagIds[getTagId(tag)]}
                  {...(hasPrev && { marginLeft: -1 })}
                  {...(hasNext && { marginRight: 0 })}
                  {...extraProps}
                  position="relative"
                  zIndex={100 - index}
                  height={height}
                />
              )

              if (tag.name === 'Delivery') {
                return (
                  <HomeFilterDelivery key={tag.id}>{button}</HomeFilterDelivery>
                )
              }

              return button
            })}
          </HStack>
        )
      })}
    </HStack>
  )
})

const HomeFilterDelivery = memo(({ children }: { children: any }) => {
  const om = useOvermind()
  return (
    <HoverablePopover
      allowHoverOnContent
      position="bottom"
      contents={
        <Box>
          <VStack>
            {Object.keys(thirdPartyCrawlSources).map((key) => {
              const item = thirdPartyCrawlSources[key]
              if (item.delivery === false) {
                return null
              }
              return (
                <HStack
                  key={key}
                  spacing={8}
                  alignItems="center"
                  paddingVertical={4}
                  paddingHorizontal={10}
                  hoverStyle={{
                    backgroundColor: '#f2f2f2',
                  }}
                >
                  <CheckBox value={true} />
                  <Image
                    source={item.image}
                    style={{ width: 24, height: 24, borderRadius: 4 }}
                  />
                  <Text ellipse fontSize={12} opacity={0.5}>
                    {item.name}
                  </Text>
                </HStack>
              )
            })}
          </VStack>
        </Box>
      }
    >
      {children}
    </HoverablePopover>
  )
})

const FilterButton = memo(
  ({
    filter,
    isActive,
    ...rest
  }: StackProps & { filter: Tag; isActive: boolean }) => {
    return (
      <LinkButton tag={filter}>
        <SmallButton isActive={isActive} {...rest}>
          {tagDisplayNames[filter.name] ?? filter.name}
        </SmallButton>
      </LinkButton>
    )
  }
)
