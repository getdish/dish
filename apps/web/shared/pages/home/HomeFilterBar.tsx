import { Tag } from '@dish/graph'
import { HStack, StackProps, VStack } from '@dish/ui'
import _ from 'lodash'
import React, { memo } from 'react'
import { Clock, ShoppingBag } from 'react-feather'
import { Image } from 'react-native'

import { getTagId } from '../../state/getTagId'
import { HomeActiveTagIds } from '../../state/home'
import { tagDisplayIcons, tagDisplayNames } from '../../state/tagDisplayName'
import { useOvermind } from '../../state/useOvermind'
import { LinkButton } from '../../views/ui/LinkButton'
import { SmallButton } from '../../views/ui/SmallButton'
import { thirdPartyCrawlSources } from './thirdPartyCrawlSources'
import { useMediaQueryIsSmall } from './useMediaQueryIs'

export default memo(({ activeTagIds }: { activeTagIds: HomeActiveTagIds }) => {
  const om = useOvermind()
  const isSmall = useMediaQueryIsSmall()

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
              const isActive = activeTagIds[getTagId(tag)]
              const button = (
                <FilterButton
                  key={`tag-${tag.id}`}
                  filter={tag}
                  isActive={isActive}
                  {...(hasPrev && { marginLeft: -1 })}
                  {...(hasNext && { marginRight: 0 })}
                  {...extraProps}
                  position="relative"
                  zIndex={100 - index - groupIndex + (isActive ? 1 : 0)}
                />
              )

              return button
            })}
          </HStack>
        )
      })}
    </HStack>
  )
})

export const FilterButton = memo(
  ({
    filter,
    isActive,
    zIndex,
    position,
    margin,
    flex,
    ...rest
  }: StackProps & { filter: Tag; isActive: boolean }) => {
    const isSmall = useMediaQueryIsSmall()
    let content: any =
      rest.children ?? tagDisplayNames[filter.name] ?? filter.name

    if (isSmall) {
      switch (content) {
        case 'Open':
          content = <Clock size={18} />
          break
        case 'Delivery':
          content = <ShoppingBag size={18} />
          break
      }
    }

    return (
      <LinkButton {...{ zIndex, flex, position, margin }} tag={filter}>
        <SmallButton
          textStyle={{ fontSize: 13, fontWeight: '500' }}
          isActive={isActive}
          {...rest}
        >
          {content}
        </SmallButton>
      </LinkButton>
    )
  }
)
