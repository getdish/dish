import React, { memo } from 'react'
import { ScrollView, Text } from 'react-native'

import { useOvermind } from '../../state/om'
import { Tag, getTagId } from '../../state/Tag'
import { LinkButton } from '../ui/Link'
import { HStack, StackBaseProps, VStack } from '../ui/Stacks'
import { bg, bgHover } from './colors'
import { SmallButton } from './SmallButton'

export default memo(function HomeFilterBar({
  activeTagIds,
}: {
  activeTagIds: { [id: string]: boolean }
}) {
  const om = useOvermind()
  return (
    <VStack paddingVertical={4} paddingBottom={6}>
      <HStack
        paddingHorizontal={30}
        paddingVertical={2}
        alignItems="center"
        spacing={4}
        justifyContent="center"
      >
        {om.state.home.allFilterTags.map((tag, index) => {
          const extraProps: StackBaseProps = {}
          let hasPrev = false
          let hasNext = false
          if (tag['groupId']) {
            hasPrev =
              om.state.home.allFilterTags[index - 1]?.['groupId'] ===
              tag['groupId']
            hasNext =
              om.state.home.allFilterTags[index + 1]?.['groupId'] ===
              tag['groupId']
            extraProps.borderTopLeftRadius = hasPrev ? 0 : 30
            extraProps.borderBottomLeftRadius = hasPrev ? 0 : 30
            extraProps.borderTopRightRadius = hasNext ? 0 : 30
            extraProps.borderBottomRightRadius = hasNext ? 0 : 30
          }
          return (
            <FilterButton
              key={tag.id}
              filter={tag}
              isActive={activeTagIds[getTagId(tag)]}
              {...(hasPrev && { marginLeft: -4, borderLeftWidth: 0 })}
              {...(hasNext && { borderRightWidth: 0 })}
              {...extraProps}
            />
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
  }: StackBaseProps & { filter: Tag; isActive: boolean }) => {
    const om = useOvermind()
    return (
      <LinkButton
        onPress={() => {
          om.actions.home.toggleTagActive(filter)
        }}
      >
        <SmallButton isActive={isActive} {...rest}>
          <Text
            style={{
              color: isActive ? '#000' : bg,
              fontSize: 15,
              fontWeight: '400',
            }}
          >
            {filter.displayName ?? filter.name}
          </Text>
        </SmallButton>
      </LinkButton>
    )
  }
)
