import { Tag } from '@dish/graph/_'
import { HStack, Text, VStack } from '@dish/ui'
import { default as React, memo } from 'react'

import { bgLight } from '../../colors'
import { tagDisplayName } from '../../state/tagDisplayName'
import { tagLenses } from '../../state/tagLenses'
import { LinkButton } from '../../views/ui/LinkButton'
import { useMediaQueryIsReallySmall } from './useMediaQueryIs'

export const HomeTopSearches = memo(() => {
  const isReallySmall = useMediaQueryIsReallySmall()
  return (
    <HStack
      paddingHorizontal={20}
      paddingVertical={10}
      marginTop={-10}
      spacing={8}
      maxWidth={700}
      marginHorizontal="auto"
      flexWrap="wrap"
      alignItems="center"
      justifyContent="center"
    >
      {recentSearches.slice(0, isReallySmall ? 6 : 8).map((search, index) => {
        return (
          <VStack
            key={index}
            borderColor="#eee"
            borderWidth={1}
            padding={3}
            paddingHorizontal={8}
            borderRadius={80}
            className="ease-in-out-slower"
            backgroundColor="#fff"
            marginBottom={8}
            hoverStyle={{
              backgroundColor: bgLight,
            }}
          >
            <LinkButton
              minWidth={50} // temp react-native
              tags={search.tags}
              cursor="pointer"
              alignItems="center"
            >
              {search.tags.map((tag, index) => (
                <React.Fragment key={tag.name}>
                  <Text
                    height={16}
                    lineHeight={16}
                    padding={5}
                    fontSize={14}
                    borderRadius={50}
                  >
                    {tag.icon ? `${tag.icon} ` : ''}
                    {tagDisplayName(tag)}
                  </Text>
                  {index < search.tags.length - 1 ? (
                    <Text marginHorizontal={2} fontSize={8} opacity={0.23}>
                      +
                    </Text>
                  ) : null}
                </React.Fragment>
              ))}
            </LinkButton>
          </VStack>
        )
      })}
    </HStack>
  )
})

const recentSearches: { tags: Tag[] }[] = [
  {
    tags: [tagLenses[0]],
  },
  {
    tags: [tagLenses[1]],
  },
  {
    tags: [tagLenses[2]],
  },
  {
    tags: [tagLenses[3]],
  },
  {
    tags: [
      { displayName: 'Cheap', name: 'price-low', type: 'filter' },
      { name: 'Pho', icon: '🍜', type: 'dish' },
    ],
  },
  {
    tags: [
      { displayName: 'Fancy', name: 'Vibe', type: 'lense' },
      { name: 'Steak', icon: '🥩', type: 'dish' },
    ],
  },
  {
    tags: [
      { name: 'Gems', type: 'lense', displayName: 'Great' },
      { name: 'Delivery', type: 'filter' },
      { name: 'Sushi', icon: '🍣', type: 'dish' },
    ],
  },
  {
    tags: [
      { name: 'Vegetarian', icon: '🥬', type: 'lense' },
      { name: 'Delivery', type: 'filter' },
      { name: 'Sandwich', icon: '🥪', type: 'dish' },
    ],
  },
  {
    tags: [
      { name: 'Gems', displayName: 'Great', type: 'lense' },
      { name: 'price-low', displayName: 'Cheap', type: 'filter' },
      { name: 'Thai', icon: '🇹🇭', type: 'country' },
    ],
  },
]
