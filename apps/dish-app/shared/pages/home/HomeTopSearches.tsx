import { Tag } from '@dish/graph/_'
import { HStack, Text, VStack } from '@dish/ui'
import { default as React, memo } from 'react'

import { bgLight } from '../../colors'
import { isWeb } from '../../constants'
import { useIsReallyNarrow } from '../../hooks/useIs'
import { tagDisplayName } from '../../state/tagDisplayName'
import { tagLenses } from '../../state/tagLenses'
import { Link } from '../../views/ui/Link'
import { LinkButton } from '../../views/ui/LinkButton'

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
              borderColor="#eee"
              borderWidth={1}
              paddingVertical={isWeb ? 0 : 8}
              paddingHorizontal={8}
              borderRadius={8}
              backgroundColor="#fff"
              marginBottom={6}
              hoverStyle={{
                backgroundColor: bgLight,
              }}
            >
              {search.tags.map((tag, index) => (
                <React.Fragment key={tag.name}>
                  <Text
                    color="#444"
                    lineHeight={isWeb ? 12 : 18}
                    paddingHorizontal={5}
                    fontSize={14}
                    borderRadius={50}
                  >
                    {tag.icon ? (
                      <Text
                        transform={[{ translateY: 2 }]}
                        marginRight={1}
                        fontSize={20}
                        lineHeight={14}
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
