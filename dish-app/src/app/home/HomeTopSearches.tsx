import React, { memo } from 'react'
import { StyleSheet } from 'react-native'
import { HStack, LinearGradient, Text } from 'snackui'

import { tagLenses } from '../../constants/localTags'
import { tagDisplayName } from '../../constants/tagMeta'
import { NavigableTag } from '../../types/tagTypes'
import { LinkButton } from '../views/LinkButton'

export const HomeTopSearches = memo(() => {
  return (
    <HStack
      paddingHorizontal={20}
      // for easier touchability
      paddingVertical={16}
      marginVertical={-10}
      spacing={6}
      marginHorizontal="auto"
      alignItems="center"
      justifyContent="center"
      overflow="hidden"
    >
      {recentSearches.map((search, index) => {
        const lenseTag =
          search.tags.find((x) => x.type === 'lense') ?? tagLenses[0]
        const hasLenseColor = !!lenseTag?.rgb
        const rgbString = hasLenseColor
          ? lenseTag.rgb.map((x) => x * 1.1).join(',')
          : ''
        return (
          <LinkButton
            key={index}
            tags={search.tags}
            asyncClick
            paddingVertical={12}
            paddingHorizontal={16}
            alignItems="center"
            borderRadius={60}
            className="safari-fix-overflow"
            position="relative"
            overflow="hidden"
            flexShrink={1}
          >
            {hasLenseColor && (
              <LinearGradient
                colors={[`rgba(${rgbString}, 0.15)`, `rgba(${rgbString},0.07)`]}
                start={[1, 1]}
                end={[-1, 1]}
                style={StyleSheet.absoluteFill}
              />
            )}
            {search.tags.map((tag, index) => (
              <React.Fragment key={tag.name}>
                {tag.icon ? (
                  <Text
                    marginRight={6}
                    fontSize={20}
                    lineHeight={20}
                    transform={[{ translateY: 0.5 }]}
                  >
                    {tag.icon.trim()}{' '}
                  </Text>
                ) : (
                  ''
                )}
                <Text
                  {...(hasLenseColor && {
                    color: `rgb(${rgbString})`,
                  })}
                  fontSize={16}
                  transform={[{ translateY: -1 }]}
                >
                  {tagDisplayName(tag)}
                </Text>
                {index < search.tags.length - 1 ? (
                  <Text
                    paddingHorizontal={8}
                    fontWeight="700"
                    fontSize={12}
                    opacity={0.23}
                    transform={[{ translateY: -3 }]}
                  >
                    +
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

const recentSearches: { tags: NavigableTag[] }[] = [
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
      {
        displayName: '$',
        name: 'price-low',
        type: 'filter',
        slug: 'filters__price-low',
      },
      { name: 'Pho', icon: '🍜', type: 'dish', slug: 'vietnamese__pho' },
    ],
  },
  {
    tags: [
      tagLenses[1],
      { name: 'Steak', icon: '🥩', type: 'dish', slug: 'american__steak' },
    ],
  },
  {
    tags: [
      {
        name: 'Delivery',
        icon: '🚗',
        type: 'filter',
        slug: 'filters__delivery',
      },
      { name: 'Sushi', icon: '🍣', type: 'dish', slug: 'japanese__sushi' },
    ],
  },
  {
    tags: [
      { ...tagLenses[0], displayName: 'Top', type: 'lense' },
      { name: 'Thai', icon: '🇹🇭', type: 'country', slug: 'asia__thai' },
    ],
  },
  {
    tags: [
      {
        name: 'Delivery',
        icon: '🚗',
        type: 'filter',
        slug: 'filters__delivery',
      },
      {
        ...tagLenses[3],
        displayName: 'Vegetarian',
        icon: '🥬',
        type: 'lense',
        slug: 'global__vegetarian',
      },
    ],
  },
]
