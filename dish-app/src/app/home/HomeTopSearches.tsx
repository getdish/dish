import React, { memo } from 'react'
import { HStack } from 'snackui'

import { tagLenses } from '../../constants/localTags'
import { rgbString } from '../../helpers/rgbString'
import { NavigableTag } from '../../types/tagTypes'
import { Link } from '../views/Link'
import { GradientButton } from './GradientButton'
import { TagsText } from './TagsText'

export const HomeTopSearches = memo(() => {
  return (
    <HStack
      paddingHorizontal={20}
      // for easier touchability
      paddingVertical={16}
      marginVertical={-10}
      spacing
      marginHorizontal="auto"
      alignItems="center"
      justifyContent="center"
      overflow="hidden"
    >
      {recentSearches.map((search, index) => {
        const rgb =
          search.tags.find((x) => x.type === 'lense')?.rgb ?? tagLenses[0].rgb
        return (
          <Link key={index} tags={search.tags} asyncClick>
            <GradientButton rgb={rgb.map((x) => x * 1.1)}>
              <TagsText tags={search.tags} color={rgbString(rgb)} />
            </GradientButton>
          </Link>
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
