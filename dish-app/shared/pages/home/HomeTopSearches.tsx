import { Tag } from '@dish/graph'
import React, { memo } from 'react'
import { StyleSheet } from 'react-native'
import { HStack, LinearGradient, Text } from 'snackui'

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
            paddingVertical={9}
            paddingHorizontal={15}
            alignItems="center"
            marginBottom={7}
            borderRadius={20}
            borderWidth={1}
            position="relative"
            overflow="hidden"
            borderColor="transparent"
            hoverStyle={{
              borderColor: rgbString ? `rgba(${rgbString}, 0.3)` : bgLightHover,
            }}
          >
            {hasLenseColor && (
              <LinearGradient
                colors={[`rgba(${rgbString}, 0.1)`, `rgba(${rgbString},0.07)`]}
                startPoint={[1, 1]}
                endPoint={[-1, 1]}
                style={StyleSheet.absoluteFill}
              />
            )}
            {search.tags.map((tag, index) => (
              <React.Fragment key={tag.name}>
                <Text
                  color="#444"
                  fontSize={14}
                  borderRadius={50}
                  fontWeight="500"
                  {...(hasLenseColor && {
                    color: `rgb(${rgbString})`,
                  })}
                >
                  {tag.icon ? (
                    <Text
                      marginRight={1}
                      fontSize={18}
                      lineHeight={18}
                      transform={[{ translateY: 1 }]}
                    >
                      {tag.icon.trim()}{' '}
                    </Text>
                  ) : (
                    ''
                  )}
                  <Text transform={[{ translateY: -1 }]}>
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
