import React, { memo } from 'react'
import { ScrollView, Text } from 'react-native'

import { useOvermind } from '../../state/om'
import { Tag, getTagId } from '../../state/Tag'
import { LinkButton } from '../shared/Link'
import { HStack, VStack } from '../shared/Stacks'
import { bg, bgHover } from './colors'
import { SmallButton } from './SmallButton'

export default memo(function HomeFilterBar({
  activeTagIds,
}: {
  activeTagIds: { [id: string]: boolean }
}) {
  const om = useOvermind()
  return (
    <VStack paddingVertical={8} paddingBottom={6}>
      <HStack
        paddingHorizontal={30}
        paddingVertical={2}
        alignItems="center"
        spacing={4}
        justifyContent="center"
      >
        {om.state.home.allFilterTags.map((tag) => (
          <FilterButton
            key={tag.id}
            filter={tag}
            isActive={activeTagIds[getTagId(tag)]}
          />
        ))}
      </HStack>
    </VStack>
  )
})

const FilterButton = memo(
  ({ filter, isActive }: { filter: Tag; isActive: boolean }) => {
    const om = useOvermind()
    return (
      <LinkButton
        onPress={() => {
          om.actions.home.toggleTag(filter)
        }}
      >
        <SmallButton isActive={isActive}>
          <Text
            style={{
              color: isActive ? '#000' : bg,
              fontSize: 15,
              fontWeight: '600',
            }}
          >
            {filter.displayName ?? filter.name}
          </Text>
        </SmallButton>
      </LinkButton>
    )
  }
)
