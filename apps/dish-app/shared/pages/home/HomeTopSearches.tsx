import { Tag } from '@dish/graph'
import { HStack, Text } from '@dish/ui'
import { default as React, memo } from 'react'

import { bgLight } from '../../colors'
import { isWeb } from '../../constants'
import { useIsReallyNarrow } from '../../hooks/useIs'
import { tagDisplayName } from '../../state/tagDisplayName'
import { tagLenses } from '../../state/tagLenses'
import { Link } from '../../views/ui/Link'

export const HomeTopSearches = memo(() => {
  const isReallySmall = useIsReallyNarrow()
  return (
    <HStack
      paddingHorizontal={20}
      paddingVertical={10}
      marginTop={-10}
      spacing={6}
      maxWidth={700}
      marginHorizontal="auto"
      flexWrap="wrap"
      alignItems="center"
      justifyContent="center"
    >
      {recentSearches.slice(0, isReallySmall ? 6 : 8).map((search, index) => {
        return (
          <Link key={index} tags={search.tags}>
            <HStack
              padding={8}
              alignItems="center"
              marginBottom={6}
              borderRadius={100}
              hoverStyle={{
                backgroundColor: bgLight,
              }}
            >
              {search.tags.map((tag, index) => (
                <React.Fragment key={tag.name}>
                  <Text
                    color="#444"
                    paddingHorizontal={5}
                    fontSize={14}
                    borderRadius={50}
                  >
                    {tag.icon ? (
                      <Text
                        transform={[{ translateY: 2 }]}
                        marginRight={1}
                        fontSize={20}
                        lineHeight={isWeb ? 16 : 22}
                      >
                        {tag.icon}{' '}
                      </Text>
                    ) : (
                      ''
                    )}
                    {tagDisplayName(tag)}
                  </Text>
                  {index < search.tags.length - 1 ? (
                    <Text marginHorizontal={2} fontSize={8} opacity={0.23}>
                      +
                    </Text>
                  ) : null}
                </React.Fragment>
              ))}
            </HStack>
          </Link>
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
      { displayName: '$', name: 'price-low', type: 'filter' },
      { name: 'Pho', icon: '🍜', type: 'dish' },
    ],
  },
  {
    tags: [
      { ...tagLenses[1], displayName: 'Fancy', type: 'lense' },
      { name: 'Steak', icon: '🥩', type: 'dish' },
    ],
  },
  {
    tags: [
      { name: 'Delivery', icon: '🚗', type: 'filter' },
      { name: 'Sushi', icon: '🍣', type: 'dish' },
    ],
  },
  {
    tags: [
      { ...tagLenses[3], displayName: 'Green', icon: '🥬', type: 'lense' },
      { name: 'Delivery', icon: '🚗', type: 'filter' },
      { name: 'Sandwich', icon: '🥪', type: 'dish' },
    ],
  },
  {
    tags: [
      { ...tagLenses[0], displayName: 'Great', type: 'lense' },
      { name: 'price-low', displayName: 'Cheap', type: 'filter' },
      { name: 'Thai', icon: '🇹🇭', type: 'country' },
    ],
  },
]
