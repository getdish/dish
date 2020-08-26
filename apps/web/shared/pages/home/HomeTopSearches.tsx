import { HStack, Text, VStack } from '@dish/ui'
import { default as React, memo } from 'react'

import { bgLight } from '../../colors'
import { tagDisplayName } from '../../state/tagDisplayName'
import { LinkButton } from '../../views/ui/LinkButton'

export const HomeTopSearches = memo(() => {
  return (
    <HStack
      paddingHorizontal={20}
      paddingVertical={10}
      marginTop={-10}
      spacing={14}
      maxWidth={700}
      marginHorizontal="auto"
      flexWrap="wrap"
      alignItems="center"
      justifyContent="center"
    >
      {recentSearches.map((search, index) => (
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
          <LinkButton tags={search.tags} cursor="pointer" alignItems="center">
            {search.tags.map((tag, index) => (
              <React.Fragment key={tag.name}>
                <Text
                  height={16}
                  lineHeight={16}
                  padding={5}
                  fontSize={16}
                  fontWeight="300"
                  borderRadius={50}
                  backgroundColor="transparent"
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
      ))}
    </HStack>
  )
})

const recentSearches = [
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
