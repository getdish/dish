import { series, sleep } from '@dish/async'
import { order_by, query, resolved } from '@dish/graph'
import { useStoreInstance } from '@dish/use-store'
import { groupBy } from 'lodash'
import React, { memo, useEffect, useMemo } from 'react'
import { AbsoluteVStack, Theme, Toast, useDebounceValue } from 'snackui'

import { tagDefaultAutocomplete } from '../constants/localTags'
import { AutocompleteItemFull, createAutocomplete } from '../helpers/createAutocomplete'
import { getFuzzyMatchQuery } from '../helpers/getFuzzyMatchQuery'
import { searchRestaurants } from '../helpers/searchRestaurants'
import { filterToNavigable } from '../helpers/tagHelpers'
import { LngLat } from '../types/homeTypes'
import { appMapStore } from './AppMapStore'
import { AutocompleteFrame, AutocompleteResults } from './AutocompleteFrame'
import { autocompleteSearchStore, autocompletesStore } from './AutocompletesStore'
import { filterAutocompletes } from './filterAutocompletes'
import { useHomeStore } from './homeStore'

export const AppAutocompleteSearch = () => {
  const autocompletes = useStoreInstance(autocompletesStore)
  return (
    <Theme name="darkTranslucent">
      <AbsoluteVStack fullscreen opacity={autocompletes.target === 'search' ? 1 : 0}>
        <AutocompleteSearchInner />
      </AbsoluteVStack>
    </Theme>
  )
}
const AutocompleteSearchInner = memo(() => {
  const home = useHomeStore()
  const store = useStoreInstance(autocompleteSearchStore)
  const { lastActiveTags } = home
  const searchState = useMemo(() => [store.query.trim(), lastActiveTags] as const, [
    store.query,
    lastActiveTags,
  ])
  const [query, activeTags] = useDebounceValue(searchState, 250)

  useEffect(() => {
    query && store.setIsLoading(true)
  }, [query])

  useEffect(() => {
    if (!query) {
      store.setResults(homeDefaultResults)
      return
    }
    let results: AutocompleteItemFull[] = []
    const postion = appMapStore.position
    const tags = filterToNavigable(activeTags)
    const countryTag = tags.length === 2 ? tags.find((x) => x.type === 'country') : null
    const cuisineName = countryTag?.name

    return series([
      async () => {
        if (cuisineName) {
          results = await resolved(() => {
            return [
              ...searchDishTags(query, cuisineName),
              ...searchRestaurants(query, postion.center, postion.span, cuisineName),
            ]
          })
        } else {
          try {
            results = await searchAutocomplete(query, postion.center, postion.span)
          } catch (err) {
            Toast.error(`Error searching ${err.message}`)
            console.error(err)
          }
        }
      },
      // allow cancel
      () => sleep(1),
      async () => {
        results = await filterAutocompletes(query, results)
      },
      setResults,
      () => {
        store.setIsLoading(false)
      },
    ])

    function setResults() {
      // add in a deduped entry
      // if multiple countries have "steak" we show a single "generic steak" entry at top
      const dishes = results.filter((x) => x.type === 'dish')
      const groupedDishes = groupBy(dishes, (x) => x.name)
      for (const [name, group] of Object.keys(groupedDishes).map(
        (x) => [x, groupedDishes[x]] as const
      )) {
        // more than one cuisine with same dish name, lets make a generic entry
        if (group.length > 1) {
          const firstIndexOfGroup = results.findIndex((x) => x.name === name)
          results.splice(
            firstIndexOfGroup,
            0,
            createAutocomplete({
              name,
              type: 'dish',
              icon: group.find((x) => x.icon)?.icon ?? '',
              slug: group[0]?.['slug'] ?? '',
            })
          )
        }
      }

      // countries that match name startsWith go to top
      const sqlower = query.toLowerCase()
      const partialCountryMatches = results
        .map((item, index) => {
          return item.type === 'country' && item.name.toLowerCase().startsWith(sqlower) ? index : -1
        })
        .filter((x) => x > 0)
      for (const index of partialCountryMatches) {
        const countryTag = results[index]
        results.splice(index, 1) // remove from cur pos
        results.splice(0, 0, countryTag) // insert into higher place
      }

      store.setResults(results)
    }
  }, [query])

  return (
    <AutocompleteFrame>
      <AutocompleteResults
        target="search"
        prefixResults={[
          {
            name: 'Enter to search',
            icon: '🔍',
            tagId: '',
            type: 'orphan' as const,
            description: '',
          },
        ]}
        onSelect={(result) => {
          // clear query
          if (result.type === 'orphan') {
            home.clearTags()
            home.setSearchQuery(query)
          } else if (result.type !== 'restaurant') {
            home.setSearchQuery('')
          }
        }}
      />
    </AutocompleteFrame>
  )
})
const homeDefaultResults = tagDefaultAutocomplete.map((tag) => {
  return createAutocomplete({
    type: 'dish',
    slug: tag.slug,
    icon: tag.icon,
    name: tag.name,
    namePrefix: 'The best',
  })
})
function searchAutocomplete(searchQuery: string, center: LngLat, span: LngLat) {
  return resolved(() => {
    return [
      ...searchDishTags(searchQuery),
      ...searchRestaurants(searchQuery, center, span),
      ...searchCuisines(searchQuery),
    ]
  })
}
function searchCuisines(searchQuery: string) {
  return query
    .tag({
      where: {
        _or: [
          {
            name: {
              _ilike: searchQuery,
            },
          },
          {
            name: {
              _ilike: getFuzzyMatchQuery(searchQuery),
            },
          },
        ],
        type: {
          _eq: 'country',
        },
      },
      limit: 3,
    })
    .map((r) => {
      return 'autocomplete' in r
        ? r
        : createAutocomplete({
            name: r.name || '',
            type: 'country',
            icon: r.icon || '🌎',
            description: 'Cuisine',
            slug: r.slug || '',
          })
    })
}
function searchDishTags(searchQuery: string, cuisine?: string) {
  return [
    ...searchDishes(
      {
        ...(searchQuery && {
          name: {
            _ilike: `${searchQuery}%`,
          },
        }),
        ...(cuisine && {
          parent: {
            name: {
              _eq: cuisine,
            },
          },
        }),
      },
      searchQuery
        ? null
        : {
            order_by: [
              {
                popularity: order_by.desc,
              },
            ],
          }
    ),
    ...(searchQuery
      ? searchDishes({
          name: {
            _ilike: getFuzzyMatchQuery(searchQuery),
          },
          ...(cuisine && {
            parent: {
              name: {
                _eq: cuisine,
              },
            },
          }),
        })
      : []),
  ].map((r) =>
    createAutocomplete({
      name: r.name ?? '',
      icon: r.icon ?? '🍽',
      type: 'dish',
      description: r.parent?.name ?? '',
      slug: r.slug ?? '',
    })
  )
}
const searchDishes = (whereCondition: any, extraQuery: any = {}, limit = 5) => {
  return query.tag({
    ...extraQuery,
    where: {
      ...whereCondition,
      type: {
        _eq: 'dish',
      },
    },
    order_by: [{ popularity: order_by.desc }],
    limit,
  })
}
