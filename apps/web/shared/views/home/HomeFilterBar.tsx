import { HStack, StackProps, Text, VStack } from '@dish/ui'
import _ from 'lodash'
import React, { memo } from 'react'

import { HomeActiveTagIds } from '../../state/home'
import { Tag, getTagId } from '../../state/Tag'
import { useOvermind } from '../../state/useOvermind'
import { LinkButton } from '../ui/LinkButton'
import { SmallButton } from './SmallButton'

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
              return (
                <FilterButton
                  key={tag.id}
                  filter={tag}
                  isActive={activeTagIds[getTagId(tag)]}
                  {...(hasPrev && { marginLeft: 0 })}
                  {...(hasNext && { marginRight: 0, zIndex: 10 - index })}
                  {...extraProps}
                  height={height}
                />
              )
            })}
          </HStack>
        )
      })}
    </HStack>
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
          {filter.displayName ?? filter.name}
        </SmallButton>
      </LinkButton>
    )
  }
)
