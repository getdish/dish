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
import { Image } from 'react-native'

import { HomeActiveTagIds } from '../../state/home'
import { Tag, getTagId } from '../../state/Tag'
import { useOvermind } from '../../state/useOvermind'
import { LinkButton } from '../ui/LinkButton'
import { deliveryServices } from './deliveryServices'
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
              const button = (
                <FilterButton
                  key={tag.id}
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
                  <HoverablePopover
                    allowHoverOnContent
                    position="bottom"
                    contents={
                      <Box>
                        <HStack flexWrap="wrap" marginTop={10}>
                          {Object.keys(deliveryServices).map((key) => {
                            const item = deliveryServices[key]
                            return (
                              <VStack
                                key={key}
                                spacing={3}
                                alignItems="center"
                                width="50%"
                                marginBottom={10}
                              >
                                <Image
                                  source={item.image}
                                  style={{ width: 40, height: 40 }}
                                />
                                <Text fontSize={12} opacity={0.5}>
                                  {item.name}
                                </Text>
                              </VStack>
                            )
                          })}
                        </HStack>
                      </Box>
                    }
                  >
                    {button}
                  </HoverablePopover>
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
