import { Tag } from '@dish/graph'
import { HStack, Text } from '@dish/ui'
import { default as React, memo } from 'react'

import { bgLight, lightBlue } from '../../colors'
import { isWeb } from '../../constants'
import { useIsReallyNarrow } from '../../hooks/useIs'
import { tagDisplayName } from '../../state/tagDisplayName'
import { tagLenses } from '../../state/tagLenses'
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
          <LinkButton
            key={index}
            tags={search.tags}
            padding={7}
            alignItems="center"
            marginBottom={7}
            borderRadius={100}
            borderWidth={1}
            borderColor={bgLight}
            hoverStyle={{
              borderColor: lightBlue,
            }}
          >
            {search.tags.map((tag, index) => (
              <React.Fragment key={tag.name}>
                <Text
                  color="#444"
                  paddingHorizontal={5}
                  fontSize={15}
                  borderRadius={50}
                >
                  {tag.icon ? (
                    <Text
                      marginRight={6}
                      fontSize={18}
                      lineHeight={22}
                      transform={[{ translateY: 1 }]}
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
                    {' '}
                    +{' '}
                  </Text>
                ) : null}
              </React.Fragment>
            ))}
          </LinkButton>
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
