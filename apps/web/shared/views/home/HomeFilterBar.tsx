import _ from 'lodash'
import React, { memo } from 'react'
import { ScrollView, Text } from 'react-native'

import { HomeActiveTagIds } from '../../state/home'
import { Tag, getTagId } from '../../state/Tag'
import { useOvermind } from '../../state/useOvermind'
import { LinkButton } from '../ui/Link'
import { HStack, StackProps, VStack } from '../ui/Stacks'
import { bg, bgHover } from './colors'
import { SmallButton } from './SmallButton'

export default memo(({ activeTagIds }: { activeTagIds: HomeActiveTagIds }) => {
  const om = useOvermind()

  let last = 0
  const grouped = _.groupBy(
    om.state.home.allFilterTags,
    (x) => x?.['groupId'] ?? ++last
  )
  const groupedList = Object.keys(grouped).map((k) => grouped[k])

  return (
    <VStack>
      <HStack
        // paddingHorizontal={30}
        alignItems="center"
        spacing={4}
        justifyContent="center"
      >
        {groupedList.map((group, index) => {
          return (
            <HStack
              key={index}
              borderRadius={100}
              // borderWidth={1}
              // borderColor={bgHover}
              // shadowColor="rgba(0,0,0,0.2)"
              // shadowRadius={4}
              // shadowOffset={{ height: 2, width: 0 }}
            >
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
                    {...(hasPrev && { marginLeft: -0.5 })}
                    {...(hasNext && { marginRight: -0.5, zIndex: 10 - index })}
                    {...extraProps}
                    height={30}
                  />
                )
              })}
            </HStack>
          )
        })}
      </HStack>
    </VStack>
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
          <Text
            style={{
              fontSize: 14,
              fontWeight: '500',
            }}
          >
            {filter.displayName ?? filter.name}
          </Text>
        </SmallButton>
      </LinkButton>
    )
  }
)
