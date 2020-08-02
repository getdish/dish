import { Tag } from '@dish/graph'
import { HStack, StackProps } from '@dish/ui'
import _ from 'lodash'
import React, { memo } from 'react'
import { Clock, ShoppingBag } from 'react-feather'

import { getTagId } from '../../state/getTagId'
import { HomeActiveTagsRecord } from '../../state/home-types'
import { tagDisplayNames } from '../../state/tagDisplayName'
import { useOvermind } from '../../state/useOvermind'
import { LinkButton } from '../../views/ui/LinkButton'
import { LinkButtonProps } from '../../views/ui/LinkProps'
import { SmallButton } from '../../views/ui/SmallButton'
import { useMediaQueryIsSmall } from './useMediaQueryIs'

export default memo(
  ({ activeTagIds }: { activeTagIds: HomeActiveTagsRecord }) => {
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
    const isSmall = useMediaQueryIsSmall()
    let content: any = rest.children ?? tagDisplayNames[tag.name] ?? tag.name

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
      <LinkButton {...{ zIndex, flex, position, margin }} tag={tag}>
        <SmallButton
          textStyle={{ fontSize: 13, fontWeight: '500' }}
          isActive={isActive}
          flex={flex}
          {...rest}
        >
          {content}
        </SmallButton>
      </LinkButton>
    )
  }
)
