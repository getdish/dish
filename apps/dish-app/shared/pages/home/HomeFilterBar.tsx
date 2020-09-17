import { HStack, StackProps } from '@dish/ui'
import _ from 'lodash'
import React, { memo } from 'react'
import { ScrollView } from 'react-native'

import { useIsNarrow } from '../../hooks/useIs'
import { getTagId } from '../../state/getTagId'
import { HomeActiveTagsRecord } from '../../state/home-types'
import { useOvermind } from '../../state/om'
import { FilterButton } from './FilterButton'

export default memo(
  ({ activeTagIds }: { activeTagIds: HomeActiveTagsRecord }) => {
    const om = useOvermind()
    const isSmall = useIsNarrow()

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
                    tag={tag}
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
  }
)
