import { tagLenses } from '../../constants/localTags'
import { NavigableTag } from '../../types/tagTypes'
import { useHomeStoreSelector } from '../homeStore'
import { Link } from '../views/Link'
import { GradientButton } from './GradientButton'
import { TagsText } from './TagsText'
import { Theme, XStack } from '@dish/ui'
import React, { memo } from 'react'

export const HomeTopSearches = memo(() => {
  const activeTags = useHomeStoreSelector((x) => x.currentState['activeTags'] || {})

  return (
    <XStack
      paddingHorizontal={10}
      // for easier touchability
      paddingVertical={10}
      marginVertical={-10}
      space="$1"
      marginHorizontal="auto"
      alignItems="center"
      justifyContent="center"
      pointerEvents="auto"
      overflow="hidden"
    >
      {recentSearches.map((search, index) => {
        // const rgb = search.tags.find((x) => x.type === 'lense')?.rgb ?? tagLenses[0].rgb
        const contents = (
          <Link key={index} tags={search.tags} asyncClick>
            <GradientButton>
              <TagsText tags={search.tags} />
            </GradientButton>
          </Link>
        )
        if (activeTags[search.tags[0]?.slug || '']) {
          return (
            <Theme key={index} name="active">
              {contents}
            </Theme>
          )
        }
        return contents
      })}
    </XStack>
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
        name: 'Delivery',
        icon: '🚗',
        type: 'filter',
        slug: 'filters__delivery',
      },
    ],
  },
  {
    tags: [
      {
        displayName: '$',
        name: 'price-low',
        type: 'filter',
        slug: 'filters__price-low',
      },
    ],
  },
  {
    tags: [
      {
        displayName: '$$$',
        name: 'price-high',
        type: 'filter',
        slug: 'filters__price-high',
      },
    ],
  },
  {
    tags: [
      {
        ...tagLenses[3],
        displayName: 'Vegetarian',
        icon: '🥬',
        type: 'lense',
        slug: 'lenses__veg',
      },
    ],
  },
  {
    tags: [{ name: 'Pho', icon: '🍜', type: 'dish', slug: 'vietnamese__pho' }],
  },
  {
    tags: [tagLenses[1]],
  },
  {
    tags: [{ name: 'Sushi', icon: '🍣', type: 'dish', slug: 'japanese__sushi' }],
  },
  {
    tags: [{ name: 'Steak', icon: '🥩', type: 'dish', slug: 'american__steak' }],
  },
  {
    tags: [{ name: 'Thai', icon: '🇹🇭', type: 'country', slug: 'asia__thai' }],
  },
]
