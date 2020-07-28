import { Tag } from '@dish/graph'
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
import { getTagId, tagDisplayNames } from '../../state/Tag'
import { useOvermind } from '../../state/useOvermind'
import { LinkButton } from '../../views/ui/LinkButton'
import { SmallButton } from '../../views/ui/SmallButton'
import { thirdPartyCrawlSources } from './thirdPartyCrawlSources'

export default memo(({ activeTagIds }: { activeTagIds: HomeActiveTagIds }) => {
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

              if (tag.name === 'Delivery') {
                return (
                  <React.Fragment key="tag-delivery">
                    {button}

                    {!!activeTagIds['delivery'] &&
                      Object.keys(thirdPartyCrawlSources).map((key) => {
                        const item = thirdPartyCrawlSources[key]
                        if (item.delivery === false) {
                          return null
                        }
                        return (
                          <VStack
                            key={key}
                            marginHorizontal={1}
                            alignItems="center"
                            padding={3}
                            borderRadius={6}
                            hoverStyle={{
                              backgroundColor: '#f2f2f2',
                            }}
                          >
                            <Image
                              source={item.image}
                              style={{ width: 20, height: 20, borderRadius: 4 }}
                            />
                          </VStack>
                        )
                      })}
                  </React.Fragment>
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

const FilterButton = memo(
  ({
    filter,
    isActive,
    zIndex,
    position,
    margin,
    ...rest
  }: StackProps & { filter: Tag; isActive: boolean }) => {
    return (
      <LinkButton {...{ zIndex, position, margin }} tag={filter}>
        <SmallButton
          textStyle={{ fontSize: 13, fontWeight: '500' }}
          isActive={isActive}
          {...rest}
        >
          {tagDisplayNames[filter.name] ?? filter.name}
        </SmallButton>
      </LinkButton>
    )
  }
)
