import { tagDefaultAutocomplete } from '../constants/localTags'
import { isTouchDevice } from '../constants/platforms'
import { AutocompleteItemFull, createAutocomplete } from '../helpers/createAutocomplete'
import { getFuzzyMatchQuery } from '../helpers/getFuzzyMatchQuery'
import { searchRestaurants } from '../helpers/searchRestaurants'
import { filterToNavigable } from '../helpers/tagHelpers'
import { LngLat } from '../types/homeTypes'
import { AutocompleteFrame } from './AutocompleteFrame'
import { AutocompleteResults } from './AutocompleteResults'
import { AutocompleteStore, autocompleteSearchStore } from './AutocompletesStore'
import { appMapStore } from './appMapStore'
import { filterAutocompletes } from './filterAutocompletes'
import { useHomeStore } from './homeStore'
import { series, sleep } from '@dish/async'
import { order_by, query, resolved } from '@dish/graph'
import { Theme, Toast, useDebounceValue, useGet } from '@dish/ui'
import { useStoreInstance } from '@dish/use-store'
import { groupBy } from 'lodash'
import React, { Suspense, memo, useCallback, useEffect, useMemo } from 'react'

export const AppAutocompleteSearch = memo(() => {
  const home = useHomeStore()
  const store = useStoreInstance(autocompleteSearchStore)
  const { lastActiveTags, currentSearchQuery } = home
  const searchState = useMemo(
    () => [store.query.trim(), lastActiveTags] as const,
    [store.query, lastActiveTags]
  )
  const [query, activeTags] = useDebounceValue(searchState, 250)
  const getQuery = useGet(query)

  useEffect(() => {
    query && store.setIsLoading(true)
  }, [query])

  useSearchQueryEffect(query, store, activeTags)

  return (
    <Theme name="dark">
      <Suspense fallback={null}>
        <AutocompleteFrame target="search">
          <AutocompleteResults
            target="search"
            prefixResults={useMemo(() => {
              return currentSearchQuery
                ? [
                    {
                      name: isTouchDevice ? 'Tap to search' : 'Enter to search',
                      icon: '🔍',
                      tagId: '',
                      type: 'orphan' as const,
                      description: '',
                    },
                  ]
                : []
            }, [currentSearchQuery])}
            onSelect={useCallback((result) => {
              // clear query
              if (result.type === 'orphan') {
                home.clearTags()
                home.setSearchQuery(getQuery())
              } else if (result.type !== 'restaurant') {
                home.setSearchQuery('')
              }
            }, [])}
          />
        </AutocompleteFrame>
      </Suspense>
    </Theme>
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

function useSearchQueryEffect(
  query: string,
  store: AutocompleteStore,
  activeTags: import('/Users/n8/dish/app/src/types/tagTypes').NavigableTag[]
) {
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
              ...searchTags(query, cuisineName),
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
        console.log('searched for', results, query)
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
          return item.type === 'country' && item.name.toLowerCase().startsWith(sqlower)
            ? index
            : -1
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
}

function searchAutocomplete(
  searchQuery: string,
  center: LngLat,
  span: LngLat
): Promise<AutocompleteItemFull[]> {
  return resolved(() => {
    return [
      ...searchTags(searchQuery),
      ...searchRestaurants(searchQuery, center, span),
      ...searchCuisines(searchQuery),
      ...searchUsers(searchQuery),
    ]
  })
}

function searchUsers(searchQuery: string) {
  return query
    .user({
      where: {
        _or: [
          {
            name: {
              _ilike: searchQuery,
            },
          },
          {
            username: {
              _ilike: searchQuery,
            },
          },
        ],
      },
      limit: 3,
    })
    .map((r) => {
      return createAutocomplete({
        name: r.name || r.username || '',
        type: 'user',
        icon: r.avatar || '',
        description: r.username,
        slug: r.username || '',
      })
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

function searchTags(searchQuery: string, cuisine?: string) {
  return [
    ...searchTagsQuery(
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
      ? searchTagsQuery({
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

const searchTagsQuery = (whereCondition: any, extraQuery: any = {}, limit = 5) => {
  return query.tag({
    ...extraQuery,
    where: {
      ...whereCondition,
      type: {
        _neq: 'country',
      },
    },
    order_by: [{ popularity: order_by.desc }],
    limit,
  })
}
