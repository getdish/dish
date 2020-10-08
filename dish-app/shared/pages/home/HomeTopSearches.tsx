import { Tag } from '@dish/graph'
import { HStack, LinearGradient, Text } from '@dish/ui'
import { default as React, memo } from 'react'
import { StyleSheet } from 'react-native'

import { bgLight, bgLightHover, lightBlue } from '../../colors'
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
      marginBottom={10}
      spacing={6}
      maxWidth={700}
      marginHorizontal="auto"
      flexWrap="wrap"
      alignItems="center"
      justifyContent="center"
      maxHeight={100}
      overflow="hidden"
    >
      {recentSearches.slice(0, isReallySmall ? 6 : 8).map((search, index) => {
        const lenseTag = search.tags.find((x) => x.type === 'lense')
        const hasLenseColor = !!lenseTag?.rgb
        const rgbString = hasLenseColor ? lenseTag.rgb.join(',') : ''
        return (
          <LinkButton
            key={index}
            tags={search.tags}
            paddingVertical={7}
            paddingHorizontal={15}
            alignItems="center"
            marginBottom={7}
            borderRadius={100}
            borderWidth={1}
            position="relative"
            overflow="hidden"
            borderColor={bgLight}
            hoverStyle={{
              borderColor: rgbString ? `rgba(${rgbString}, 0.3)` : bgLightHover,
            }}
          >
            {hasLenseColor && (
              <LinearGradient
                colors={[`rgba(${rgbString}, 0.1)`, `rgba(${rgbString},0)`]}
                startPoint={[0, 1]}
                endPoint={[1, 0]}
                style={StyleSheet.absoluteFill}
              />
            )}
            {search.tags.map((tag, index) => (
              <React.Fragment key={tag.name}>
                <Text
                  color="#444"
                  fontSize={15}
                  borderRadius={50}
                  fontWeight="500"
                  {...(hasLenseColor && {
                    color: `rgb(${rgbString})`,
                  })}
                >
                  {tag.icon ? (
                    <Text
                      marginRight={3}
                      fontSize={22}
                      lineHeight={22}
                      transform={[{ translateY: 1 }]}
                    >
                      {tag.icon.trim()}{' '}
                    </Text>
                  ) : (
                    ''
                  )}
                  <Text transform={[{ translateY: -2 }]}>
                    {tagDisplayName(tag)}
                  </Text>
                </Text>
                {index < search.tags.length - 1 ? (
                  <Text
                    paddingHorizontal={8}
                    fontWeight="700"
                    fontSize={12}
                    opacity={0.23}
                  >
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
      { ...tagLenses[0], displayName: 'Top', type: 'lense' },
      { name: 'Thai', icon: '🇹🇭', type: 'country' },
    ],
  },
  {
    tags: [
      { name: 'Delivery', icon: '🚗', type: 'filter' },
      { ...tagLenses[3], displayName: 'Vegetarian', icon: '🥬', type: 'lense' },
    ],
  },
]
